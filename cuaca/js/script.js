document.addEventListener('DOMContentLoaded', () => {
    const masukanKota = document.getElementById('masukan-kota');// ID tetap
    const tombolCari = document.getElementById('tombol-cari');     
    const tampilanCuaca = document.getElementById('tampilan-cuaca'); 
    const pesanError = document.getElementById('pesan-error');       

    const KUNCI_API = '62607c296e95b49b218cb18f2f02f1f1';
    const URL_WEB = 'https://api.openweathermap.org/data/2.5/weather';

    async function dapatkanDataCuaca(kota) {
        pesanError.textContent = ''; 
        tampilanCuaca.innerHTML = '<p class="teks-placeholder">Mencari data...</p>'; 

        try {
            const response = await fetch(`${URL_WEB}?q=${kota}&units=metric&lang=id&appid=${KUNCI_API}`);

            if (!response.ok) {
                
                if (response.status === 404) {
                    throw new Error('Kota tidak ditemukan.');
                } else if (response.status === 401) {
                    throw new Error('API Key tidak valid atau ada masalah otentikasi.');
                } else {
                    throw new Error(`Terjadi kesalahan: ${response.statusText}`);
                }
            }

            const data = await response.json();
            tampilkanDataCuaca(data);

        } catch (error) {
            tampilanCuaca.innerHTML = ''; 
            pesanError.textContent = error.message || 'Gagal mengambil data cuaca.';
            console.error('Fetch error:', error);
        }
    }

    function tampilkanDataCuaca(data) {
        tampilanCuaca.innerHTML = ''; 

        if (!data || !data.main || !data.weather || !data.name) {
            pesanError.textContent = 'Data cuaca tidak lengkap.';
            return;
        }

        const kota = data.name;
        const negara = data.sys.country;
        const suhu = Math.round(data.main.temp); 
        const deskripsi = data.weather[0].description;
        const kelembaban = data.main.humidity;
        const kecepatanAngin = data.wind.speed; 


        const kodeIkonCuaca = data.weather[0].icon;
        const urlIkon = `http://openweathermap.org/img/wn/${kodeIkonCuaca}@2x.png`;

        const htmlCuaca = `
            <div class="info-cuaca">
                <h2>${kota}, ${negara}</h2>
                <img src="${urlIkon}" alt="${deskripsi}" class="ikon-cuaca">
                <p class="suhu">${suhu}°C</p>
                <p class="deskripsi">${deskripsi}</p>
                <div class="detail-cuaca">
                    <div class="item-detail">
                        <i class="fas fa-water"></i>
                        <p>${kelembaban}%</p>
                        <p>Kelembaban</p>
                    </div>
                    <div class="item-detail">
                        <i class="fas fa-wind"></i>
                        <p>${kecepatanAngin} m/s</p>
                        <p>Kecepatan Angin</p>
                    </div>
                </div>
            </div>
        `;
        tampilanCuaca.innerHTML = htmlCuaca;
    }

    // Event Listener untuk tombol pencarian
    tombolCari.addEventListener('click', () => {
        const kota = masukanKota.value.trim();
        if (kota) {
            dapatkanDataCuaca(kota);
        } else {
            pesanError.textContent = 'Nama kota tidak boleh kosong.';
            tampilanCuaca.innerHTML = '<p class="teks-placeholder">Masukkan kota untuk melihat cuaca.</p>';
        }
    });

    // Event Listener untuk tombol Enter di input
    masukanKota.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            tombolCari.click(); 
        }
    });

});