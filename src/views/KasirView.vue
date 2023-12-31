<script setup>
import { onMounted, ref } from "vue";
import {
  collection, addDoc, serverTimestamp, query, orderBy, onSnapshot, doc, getDoc, updateDoc, deleteDoc
} from "firebase/firestore";
import { db } from "@/firebase";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const convertToPDF = () => {
  const cardsToPrint = document.querySelectorAll('.target');

  const pdfWidth = 100; // Lebar halaman PDF dalam mm (A4, misalnya)
  const pdf = new jsPDF('p', 'mm', 'a4');

  const promises = [];

  cardsToPrint.forEach((card) => {
    const pdfElementWidth = pdf.internal.pageSize.getWidth();

    card.style.width = `${pdfElementWidth}px`; // Mengatur lebar elemen sesuai dengan lebar halaman PDF

    promises.push(
      html2canvas(card).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, (pdfWidth * canvas.height) / canvas.width);
        pdf.addPage();
      })
    );
  });

  Promise.all(promises).then(() => {
    pdf.save('cards.pdf');
  });
};

const makananInputs = ref([{ menu: '', harga: 0, jumlah: 0, diantar: false }]);
const minumanInputs = ref([{ menu: '', harga: 0, jumlah: 0, diantar: false }]);
const nama = ref(""); // Menyimpan nama order
const table = ref(""); // Menyimpan nama order

const addInputMakanan = () => {
  makananInputs.value.push({ menu: '', harga: 0, jumlah: 0, diantar: false });
};
const addInputMinuman = () => {
  minumanInputs.value.push({ menu: '', harga: 0, jumlah: 0, diantar: false });
};

const menuOptions = [
  { id: 1, name: 'Nasi Goreng', harga: 15000 },
  { id: 2, name: 'Ayam Goreng', harga: 25000 },
  { id: 3, name: 'Mie Goreng', harga: 10000 },
];
const drinkOptions = [
  { id: 1, name: 'Teh Obeng', harga: 5000 },
  { id: 2, name: 'Es Jeruk', harga: 10000 },
  { id: 3, name: 'Jus Alpukat', harga: 15000 },
];

const updateHarga = (index) => {
  const selectedMenu = makananInputs.value[index].menu;
  const selectedOption = menuOptions.find((option) => option.name === selectedMenu);

  if (selectedOption) {
    makananInputs.value[index].harga = selectedOption.harga;
  }
};
const updateHargaMinuman = (index) => {
  const selectedMenu = minumanInputs.value[index].menu;
  const selectedOption = drinkOptions.find((option) => option.name === selectedMenu);

  if (selectedOption) {
    minumanInputs.value[index].harga = selectedOption.harga;
  }
};

const submitOrder = async () => {
  try {
    const ordersCollection = collection(db, "orders");

    const orderData = {
      order: makananInputs.value,
      minuman: minumanInputs.value,
      when: serverTimestamp(),
      nama: nama.value,
      table: table.value,
      onProcess: false,
      receiveByCustomer: false,
      payed: false,
    };

    await addDoc(ordersCollection, orderData);

    makananInputs.value = [{ menu: "", jumlah: 0 }];
    minumanInputs.value = [{ menu: "", jumlah: 0 }];
    nama.value = ""; // Reset nama setelah submit
    table.value = ""; // Reset nama setelah submit

    console.log("Data berhasil dikirim ke Firestore");
  } catch (error) {
    console.error("Terjadi kesalahan:", error);
  }
};

const transactionCollectionQuery = query(
  collection(db, "completedOrder"),
  orderBy("when", "asc")
  // limit(10)
);

const datas = ref([]);
const back = () => {
  loadDatas()
}
const loadDatas = () => {
  onSnapshot(transactionCollectionQuery, (querySnapshot) => {
    const fbData = [];

    querySnapshot.forEach((doc) => {
      const data = {
        id: doc.id,
        nama: doc.data().nama,
        onProcess: doc.data().onProcess,
        payed: doc.data().payed,
        receiving: doc.data().receiveByCustomer,
        table: doc.data().table,
        when: doc.data().when,
        minuman: doc.data().minuman,
        order: doc.data().order,
      };
      fbData.push(data);
    });

    datas.value = fbData;
  });
};

onMounted(() => {
  loadDatas();
});

const diantar = async (docId, orderIndex) => {
  try {
    const orderRef = collection(db, "completedOrder");
    const docRef = doc(orderRef, docId);

    const docSnapshot = await getDoc(docRef);
    if (docSnapshot.exists()) {
      const orders = docSnapshot.data().order;

      // Ubah status diantar pada indeks yang ditentukan
      orders[orderIndex].diantar = !orders[orderIndex].diantar;

      // Perbarui nilai order dalam dokumen
      await updateDoc(docRef, { order: orders });

      console.log(`Pesanan dengan ID ${docId} dan indeks ${orderIndex} telah diberi tanda sudah diantar.`);
    } else {
      console.error("Dokumen tidak ditemukan!");
    }
  } catch (error) {
    console.error("Terjadi kesalahan saat memberi tanda pesanan telah diantar:", error);
  }
};
const minumanDiantar = async (docId, orderIndex) => {
  try {
    const orderRef = collection(db, "completedOrder");
    const docRef = doc(orderRef, docId);

    const docSnapshot = await getDoc(docRef);
    if (docSnapshot.exists()) {
      const orders = docSnapshot.data().minuman;

      // Ubah status diantar pada indeks yang ditentukan
      orders[orderIndex].diantar = !orders[orderIndex].diantar;

      // Perbarui nilai order dalam dokumen
      await updateDoc(docRef, { minuman: orders });

      console.log(`Pesanan dengan ID ${docId} dan indeks ${orderIndex} telah diberi tanda sudah diantar.`);
    } else {
      console.error("Dokumen tidak ditemukan!");
    }
  } catch (error) {
    console.error("Terjadi kesalahan saat memberi tanda pesanan telah diantar:", error);
  }
};

const completeOrder = async (orderId) => {
  try {
    const orderRef = doc(collection(db, "orders"), orderId);
    const orderSnapshot = await getDoc(orderRef);

    if (orderSnapshot.exists()) {
      const orderData = orderSnapshot.data();

      // Menambahkan data ke koleksi completedOrder
      const completedOrderRef = collection(db, "completedOrder");
      await addDoc(completedOrderRef, orderData);

      // Menghapus data dari koleksi orders
      await deleteDoc(orderRef);

      console.log(`Pesanan dengan ID ${orderId} telah selesai dan dipindahkan ke completedOrder.`);
    } else {
      console.error("Dokumen tidak ditemukan!");
    }
  } catch (error) {
    console.error("Terjadi kesalahan saat menyelesaikan pesanan:", error);
  }
};

const totalHarga = (orderId) => {
  const order = datas.value.find((data) => data.id === orderId);
  let total = 0;

  if (order) {
    order.order.forEach((item) => {
      total += item.harga * item.jumlah;
    });

    order.minuman.forEach((item) => {
      total += item.harga * item.jumlah;
    });
  }

  return `${total}`;
};

const print = (orderId) => {
  // Filter datas berdasarkan orderId yang diberikan
  datas.value = datas.value.filter((data) => data.id === orderId);
};
</script>

<template>
  <div class="main-con">
    <h1 class="welcome"><img src="../assets/wok.png" width="200" alt=""></h1>

    <div id="queue-con">
      <h1>Pesanan Belum Di Bayar</h1>

      <div class="card-con">
        <div class="card" v-for="(data, index) in datas" :key="data.id">
          <div class="target" style="padding: 20px;">
            <p style="text-align: center;font-weight: 800;">Warung Tok Aba</p> <br>
            <p style="text-align: center; margin: -10px 0;">Sampai Jumpa</p> <br>
            <p style="text-align: center; margin: -10px 0;">Nama : {{ data.nama }}</p> <br>
            <p style="text-align: center; margin: -10px 0;">Terima Kasih</p> <br>
            <table>
              <!-- <thead>
              <tr>
                <th>Makanan</th>
                <th>Jumlah</th>
                <th>Harga</th>
                <th>Status</th>
              </tr>
            </thead> -->
              <tbody>
                <tr v-for="(x, index) in data.order" :key="x.id">
                  <td>{{ x.menu }}</td>
                  <td>{{ x.jumlah }}</td>
                  <td>Rp {{ x.harga }}</td>
                  <!-- <td><button class="actBtn" @click="diantar(data.id, index)"> {{ !x.diantar ? "Belum" : "sudah" }}
                    </button></td> -->
                </tr>
              </tbody>
            </table>

            <table>
              <!-- <thead>
              <tr>
                <th>Minuman</th>
                <th>Jumlah</th>
                <th>Harga</th>
                <th>Status</th>
              </tr>
            </thead> -->
              <tbody>
                <tr v-for="(x, index) in data.minuman" :key="x.id">
                  <td>{{ x.menu }}</td>
                  <td>{{ x.jumlah }}</td>
                  <td>Rp {{ x.harga }}</td>
                  <!-- <td><button class="actBtn" @click="minumanDiantar(data.id, index)"> {{ !x.diantar ? "Belum" : "sudah" }}
                    </button></td> -->
                </tr>
              </tbody>
            </table>

            <table>
              <tbody>
                <tr>
                  <td style="text-align: center;color:black;border: none;">Total Harga : Rp {{ totalHarga(data.id) }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="btn-group">
            <button @click="print(data.id)">Bayar</button>
            <button @click="convertToPDF()">Print</button>
            <button @click="back()">Back</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.main-con {
  min-height: calc(93vh - 40px);
  width: calc(100% - 40px);
  background-color: rgb(185, 186, 187);
  background-image: url(../assets/back.jpg);
  background-blend-mode: multiply;
  background-size: cover;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}



#queue-con {
  background-color: rgba(240, 248, 255, 0.622);
  width: fit-content;
  min-height: 200px;
  margin-top: 20px;
  padding: 20px;
  border-radius: 20px;

}

.main-con h1 {
  text-align: center;
  margin-bottom: 10px;
}


.form-con {
  width: 100%;
  height: calc(100% - 20px);
  display: flex;
  justify-content: center;
  align-items: center;
}

.form-con form {
  background-color: rgba(255, 255, 255, 0.508);
  border-radius: 10px;
  padding: 30px;
  backdrop-filter: blur(3px);
  display: flex;
  flex-direction: column;
  gap: 10px;
  box-sizing: border-box;
}



.form-con form .order {
  display: flex;
  gap: 10px;
}

.form-con form input {
  padding: 10px;
}



#submit {
  padding: 10px;
  border-radius: 10px;
  background-color: rgba(255, 204, 0, 0.585);
  color: rgb(6, 6, 6);
  font-weight: 700;
  letter-spacing: 2px;
  cursor: pointer;
  border: none;
  outline: none;
  box-shadow: 0 0 5px rgb(77, 77, 77);
  margin-top: 20px;
}

.main-con #queue-con .card-con {
  min-height: 20px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
}

.main-con #queue-con .card-con .card {
  background-color: transparent;
  padding: 20px;
  border-radius: 10px;
}

.actBtn {
  padding: 2px 10px;
  border: none;
  outline: none;
  color: black;
  border-radius: 5px;
  cursor: pointer;
}

@media (max-width:500px) {
  .main-con {
    padding: 20px 0;
    width: 100%;
  }

  .form-con form {
    width: 100%;
  }

  .form-con form .jumlah {
    width: 70px;
  }

  #menu {
    width: 100px;
  }

  .main-con #queue-con .card-con .card {
    width: 100%;
  }

  #queue-con {
    padding: 20px 0
  }

  .form-con form .order {

    justify-content: space-between;
  }
}

.main-con #queue-con .card-con .card table {
  border-collapse: collapse;
  width: 100%;
  margin-top: 20px;
  border-radius: 10px;
  overflow: hidden;

}

.main-con #queue-con .card-con .card table td,
.main-con #queue-con .card-con .card table th {
  border: 1px solid #dddddd;
  text-align: left;
  padding: 10px;
  background-color: rgb(255, 255, 255);
}

.main-con #queue-con .card-con .card .btn-group {
  display: flex;
  justify-content: center;
  width: 100%;
  margin-top: 20px;
  gap: 10px;
}

.main-con #queue-con .card-con .card .btn-group button {
  padding: 10px 20px;
  width: 100%;
  background-color: rgb(255, 119, 0);
  color: white;
  font-weight: 800;
  border-radius: 10px;
  border: none;
  outline: none;
  cursor: pointer;
}</style>