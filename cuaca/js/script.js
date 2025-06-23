document.addEventListener('DOMContentLoaded', () => {
    const masukanKota = document.getElementById('masukan-kota');
    const tombolCari = document.getElementById('tombol-cari');
    const tampilanCuaca = document.getElementById('tampilan-cuaca');
    const pesanError = document.getElementById('pesan-error');

    // API KEY
    const API_KEY = 'e553a1b0e58445cc83934445252306';
    // URL API Website untuk cuaca saat ini
    const URL_WEATHERAPI = 'https://api.weatherapi.com/v1/current.json';

    async function dapatkanDataCuaca(kota) {
        pesanError.textContent = ''; 
        tampilanCuaca.innerHTML = '<p class="teks-placeholder">Mencari data...</p>'; 

        try {
            // Permintaan ke WeatherAPI.com
            const response = await fetch(`${URL_WEATHERAPI}?key=${API_KEY}&q=${kota}&lang=id`);

            if (!response.ok) {
                // Tangani error HTTP
                const errorData = await response.json(); 
                let errorMessageText = 'Gagal mengambil data cuaca.';

                if (response.status === 400 && errorData.error && errorData.error.message) {
                
                    errorMessageText = `Kesalahan: ${errorData.error.message}`;
                } else if (response.status === 403) {
                    errorMessageText = 'API Key tidak valid atau ada masalah otentikasi.';
                } else {
                    errorMessageText = `Terjadi kesalahan: ${response.statusText}`;
                }
                throw new Error(errorMessageText);
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

        
        if (!data || !data.current || !data.location) {
            pesanError.textContent = 'Data cuaca tidak lengkap atau format tidak sesuai.';
            return;
        }

        const kota = data.location.name;
        const negara = data.location.country;
        const suhu = Math.round(data.current.temp_c); 
        const deskripsi = data.current.condition.text;
        const kelembaban = data.current.humidity;
        const kecepatanAngin = data.current.wind_kph; 

        // Ikon cuaca dari WeatherAPI.com
        const urlIkon = data.current.condition.icon; 

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
                        <p>${kecepatanAngin} km/j</p> <p>Kecepatan Angin</p>
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