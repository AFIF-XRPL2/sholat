// Fungsi untuk jam digital
function updateClock() {
    const clockElement = document.getElementById("clock");
    const now = new Date();
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    };
    clockElement.textContent = now.toLocaleDateString("id-ID", options);
  }
  
  // Update jam setiap detik
  setInterval(updateClock, 1000);
  updateClock();
  
  // Fungsi untuk menampilkan animasi loading
  function showLoading() {
    const prayerTimesElement = document.getElementById("prayer-times");
    prayerTimesElement.innerHTML = `
      <div class="flex justify-center items-center my-5">
        <div class="flex flex-row gap-2">
          <div class="w-4 h-4 rounded-full bg-blue-700 animate-bounce [animation-delay:.7s]"></div>
          <div class="w-4 h-4 rounded-full bg-blue-700 animate-bounce [animation-delay:.3s]"></div>
          <div class="w-4 h-4 rounded-full bg-blue-700 animate-bounce [animation-delay:.7s]"></div>
        </div>
      </div>
    `;
  }
  
  // Fungsi untuk menghapus animasi loading setelah data berhasil ditampilkan
  function hideLoading() {
    const prayerTimesElement = document.getElementById("prayer-times");
    prayerTimesElement.innerHTML = "";
  }
  
  // Fungsi untuk mengambil jadwal sholat berdasarkan nama kota
  function fetchPrayerTimesByCity(city) {
    const url = `https://api.aladhan.com/v1/timingsByCity?city=${city}&country=Indonesia&method=2`;
  
    // Tampilkan animasi loading
    showLoading();
  
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        hideLoading(); // Sembunyikan animasi loading
        displayPrayerTimes(data.data.timings);
      })
      .catch((error) => {
        hideLoading(); // Sembunyikan animasi loading
        console.error("Error fetching data:", error);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Gagal mendapatkan jadwal sholat. Silakan coba lagi.",
        });
      });
  }
  
  // Fungsi untuk menampilkan jadwal sholat dengan gaya yang disesuaikan
  function displayPrayerTimes(timings) {
    const prayerTimesElement = document.getElementById("prayer-times");
    prayerTimesElement.innerHTML = ""; // Bersihkan dulu
  
    const prayerNames = {
      Fajr: "Subuh",
      Sunrise: "Terbit",
      Dhuhr: "Dzuhur",
      Asr: "Ashar",
      Maghrib: "Maghrib",
      Isha: "Isya",
    };
  
    const prayerIcons = {
      Fajr: "fa-sun",
      Sunrise: "fa-cloud-sun",
      Dhuhr: "fa-clock",
      Asr: "fa-cloud",
      Maghrib: "fa-moon",
      Isha: "fa-star",
    };
  
    for (const [prayer, time] of Object.entries(timings)) {
      if (prayerNames[prayer]) {
        const li = document.createElement("li");
        li.className =
          "flex justify-between items-center p-3 bg-green-50 rounded-lg shadow-sm hover:bg-green-100 transition duration-300 border border-green-200";
        li.innerHTML = `
          <span class="font-semibold text-green-800">
            <i class="fas ${prayerIcons[prayer]} mr-2 text-green-500"></i>${prayerNames[prayer]}
          </span>
          <span class="font-bold text-green-700">${time}</span>
        `;
        prayerTimesElement.appendChild(li);
      }
    }
  }
  
  // Fungsi untuk mendapatkan lokasi pengguna
  function getUserLocation() {
    if (navigator.geolocation) {
      // Tampilkan animasi loading saat mendeteksi lokasi
      showLoading();
  
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
  
          // Ambil nama kota berdasarkan koordinat
          const locationUrl = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=id`;
  
          fetch(locationUrl)
            .then((response) => response.json())
            .then((locationData) => {
              const city = locationData.city || locationData.locality || "Jakarta";
              document.getElementById("city-input").value = city; // Masukkan nama kota ke input
              fetchPrayerTimesByCity(city); // Ambil jadwal sholat
            })
            .catch((error) => {
              hideLoading(); // Sembunyikan animasi loading
              console.error("Error fetching location:", error);
              Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Gagal mendapatkan lokasi Anda. Silakan masukkan nama kota secara manual.",
              });
            });
        },
        (error) => {
          hideLoading(); // Sembunyikan animasi loading
          console.error("Geolocation error:", error);
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Tidak dapat mendeteksi lokasi Anda. Silakan masukkan nama kota secara manual.",
          });
        }
      );
    } else {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Geolocation tidak didukung di browser Anda.",
      });
    }
  }
  
  // Event listener untuk tombol Search
  document.getElementById("search-button").addEventListener("click", () => {
    const city = document.getElementById("city-input").value;
    if (city) {
      fetchPrayerTimesByCity(city);
    } else {
      Swal.fire({
        icon: "warning",
        title: "Perhatian",
        text: "Masukkan nama kota terlebih dahulu.",
      });
    }
  });
  
  // Event listener untuk menekan Enter
  document.getElementById("city-input").addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
      const city = event.target.value;
      if (city) {
        fetchPrayerTimesByCity(city);
      } else {
        Swal.fire({
          icon: "warning",
          title: "Perhatian",
          text: "Masukkan nama kota terlebih dahulu.",
        });
      }
    }
  });
  
  // Panggil fungsi untuk mendapatkan lokasi pengguna saat halaman dimuat
  window.onload = () => {
    getUserLocation();
  };
  