window.onload = function() {

    // === DOĞRUDAN GİRİŞ İNTROSU (OTOMATİK OYNATMA) ===
    // Not: Tarayıcı izin verirse ses çalar, vermezse animasyon sessiz devam eder.
    const introMusic = new Audio('audio/intro_music.mp3');
    introMusic.volume = 0.7;

    // Müziği başlatmaya zorla
    const playPromise = introMusic.play();
    if (playPromise !== undefined) {
        playPromise.catch(error => {
            console.log("Otomatik oynatma tarayıcı tarafından engellendi. Intro sessiz devam edecek.");
        });
    }

    // Animasyon Zaman Çizelgesi
    const introTl = gsap.timeline({
        onComplete: () => {
            // Intro bitince ekranı kaldır
            gsap.to('#intro-screen', { 
                duration: 1.0, 
                opacity: 0, 
                onComplete: () => {
                    document.getElementById('intro-screen').style.display = 'none';
                    introMusic.pause(); // Müzik hala çalıyorsa sustur
                }
            });
        }
    });

    // Müzikle Senkronize Animasyon Akışı (2.5 saniyede patlama)
    introTl.fromTo('.intro-content', 
        { opacity: 0, scale: 0.8, y: 30, filter: "blur(10px)", visibility: 'visible' },
        { duration: 2.5, opacity: 1, scale: 1, y: 0, filter: "blur(0px)", ease: "power2.out" }
    )
    .to('.intro-content', { // Peak noktası (Müzik patlaması)
        duration: 0.15, scale: 1.15, filter: "brightness(2)", ease: "power1.inOut"
    })
    .to('.intro-content', { // Yok oluş
        duration: 0.8, opacity: 0, scale: 1.5, filter: "blur(20px)", ease: "power2.in"
    }, "+=0.2"); // Patlamadan sonra çok kısa bekle ve yok ol


    // === TÜM DÜNYA BAŞKENTLERİ (Otomatik Tamamlama İçin) ===
    const allCapitals = [
        "Abu Dhabi", "Abuja", "Accra", "Addis Ababa", "Algiers", "Amman", "Amsterdam", "Andorra la Vella", "Ankara", "Antananarivo", "Apia", "Ashgabat", "Asmara", "Asuncion", "Athens", "Baghdad", "Baku", "Bamako", "Bandar Seri Begawan", "Bangkok", "Bangui", "Banjul", "Basseterre", "Beijing", "Beirut", "Belgrade", "Belmopan", "Berlin", "Bern", "Bishkek", "Bissau", "Bogota", "Brasilia", "Bratislava", "Brazzaville", "Bridgetown", "Brussels", "Bucharest", "Budapest", "Buenos Aires", "Bujumbura", "Cairo", "Canberra", "Caracas", "Castries", "Chisinau", "Conakry", "Copenhagen", "Dakar", "Damascus", "Dhaka", "Dili", "Djibouti", "Dodoma", "Doha", "Dublin", "Dushanbe", "Freetown", "Funafuti", "Gaborone", "Georgetown", "Gitega", "Guatemala City", "Hanoi", "Harare", "Havana", "Helsinki", "Honiara", "Islamabad", "Jakarta", "Jerusalem", "Juba", "Kabul", "Kampala", "Kathmandu", "Khartoum", "Kiev", "Kigali", "Kingston", "Kinshasa", "Kuala Lumpur", "Kuwait City", "Libreville", "Lilongwe", "Lima", "Lisbon", "Ljubljana", "Lome", "London", "Luanda", "Lusaka", "Luxembourg", "Madrid", "Majuro", "Malabo", "Male", "Managua", "Manama", "Manila", "Maputo", "Maseru", "Mbabane", "Melekeok", "Mexico City", "Minsk", "Mogadishu", "Monaco", "Monrovia", "Montevideo", "Moroni", "Moscow", "Muscat", "Nairobi", "Nassau", "Naypyidaw", "N'Djamena", "New Delhi", "Ngerulmud", "Niamey", "Nicosia", "Nouakchott", "Nuku'alofa", "Nur-Sultan", "Oslo", "Ottawa", "Palikir", "Panama City", "Paramaribo", "Paris", "Phnom Penh", "Podgorica", "Port Louis", "Port Moresby", "Port of Spain", "Port-au-Prince", "Porto-Novo", "Prague", "Praia", "Pretoria", "Pristina", "Pyongyang", "Quito", "Rabat", "Reykjavik", "Riga", "Riyadh", "Rome", "Roseau", "Saint George's", "Saint John's", "San Jose", "San Marino", "San Salvador", "Sana'a", "Santiago", "Santo Domingo", "Sao Tome", "Sarajevo", "Seoul", "Singapore", "Skopje", "Sofia", "South Tarawa", "Sri Jayawardenepura Kotte", "Stockholm", "Sucre", "Suva", "Taipei", "Tallinn", "Tashkent", "Tbilisi", "Tegucigalpa", "Tehran", "Thimphu", "Tirana", "Tokyo", "Tripoli", "Tunis", "Ulaanbaatar", "Vaduz", "Valletta", "Victoria", "Vienna", "Vientiane", "Vilnius", "Warsaw", "Washington", "Wellington", "Windhoek", "Yamoussoukro", "Yaounde", "Yerevan", "Zagreb"
    ];

    // === GÜNCELLENMİŞ OYUN VERİTABANI ===
    const gameData = [
        { city: "Paris", city_tr: "Paris", country: "France", coords: [2.3522, 48.8566], hint_food: "images/ipucu-paris.png", hint_food_name: "Croissant", hint_colors: ['#0055A4', '#FFFFFF', '#EF4135'], flag_img: "images/flag-fransa.png", info_history: "Known as the 'City of Light'. Home to the Eiffel Tower.", info_cuisine: "Famous for croissants, baguettes, macarons, and wine." },
        { city: "Tokyo", city_tr: "Tokyo", country: "Japan", coords: [139.6917, 35.6895], hint_food: "images/ipucu-tokyo.png", hint_food_name: "Sushi", hint_colors: ['#FFFFFF', '#BC002D'], flag_img: "images/flag-japonya.png", info_history: "Formerly named 'Edo'. A mix of modern skyscrapers and traditional temples.", info_cuisine: "The home of sushi, sashimi, and ramen. Known for fresh seafood." },
        { city: "Cairo", city_tr: "Kahire", country: "Egypt", coords: [31.2357, 30.0444], hint_food: "images/ipucu-cairo.png", hint_food_name: "Koshari", hint_colors: ['#CE1126', '#FFFFFF', '#000000'], flag_img: "images/flag-misir.png", info_history: "'The City of a Thousand Minarets'. Near the Pyramids of Giza.", info_cuisine: "Famous for street food like Koshari, Ful Medames, and Ta'ameya." },
        { city: "Ankara", city_tr: "Ankara", country: "Türkiye", coords: [32.8597, 39.9334], hint_food: "images/ipucu-ankara.png", hint_food_name: "Simit", hint_colors: ['#E30A17', '#FFFFFF'], flag_img: "images/flag-turkiye.png", info_history: "The capital of the Republic of Türkiye. Home to Anıtkabir.", info_cuisine: "Known for Ankara Tava (roast) and the famous 'simit'." },
        { city: "Rome", city_tr: "Roma", country: "Italy", coords: [12.4964, 41.9028], hint_food: "images/ipucu-rome.png", hint_food_name: "Spaghetti", hint_colors: ['#008C45', '#F4F5F0', '#CD212A'], flag_img: "images/flag-italya.png", info_history: "The 'Eternal City'. Full of ancient wonders like the Colosseum.", info_cuisine: "Home of Carbonara and Cacio e Pepe pasta, pizza, and gelato." },
        { city: "London", city_tr: "Londra", country: "United Kingdom", coords: [-0.1276, 51.5072], hint_food: "images/ipucu-london.png", hint_food_name: "English Breakfast", hint_colors: ['#012169', '#FFFFFF', '#C8102E'], flag_img: "images/flag-birlesik-krallik.png", info_history: "Founded by the Romans. Home to the Tower of London and Buckingham Palace.", info_cuisine: "Famous for Fish and Chips, Sunday Roast, and Afternoon Tea." },
        { city: "Berlin", city_tr: "Berlin", country: "Germany", coords: [13.4050, 52.5200], hint_food: "images/ipucu-berlin.png", hint_food_name: "Currywurst", hint_colors: ['#000000', '#DD0000', '#FFCC00'], flag_img: "images/flag-almanya.png", info_history: "Divided by the Berlin Wall during the Cold War. Symbolized by the Brandenburg Gate.", info_cuisine: "Famous for street food like Currywurst. Schnitzel is also popular." },
        { city: "Madrid", city_tr: "Madrid", country: "Spain", coords: [-3.7038, 40.4168], hint_food: "images/ipucu-madrid.png", hint_food_name: "Paella", hint_colors: ['#AA151B', '#F1B53B'], flag_img: "images/flag-ispanya.png", info_history: "The heart of Spain. Known for the Royal Palace and Prado Museum.", info_cuisine: "Center of 'tapas' culture. Try Jamón Ibérico and Churros with chocolate." },
        { city: "Moscow", city_tr: "Moskova", country: "Russia", coords: [37.6173, 55.7558], hint_food: "images/ipucu-moscow.png", hint_food_name: "Pelmeni", hint_colors: ['#FFFFFF', '#0039A6', '#D52B1E'], flag_img: "images/flag-rusya.png", info_history: "Famous for the Red Square, the Kremlin, and St. Basil's Cathedral.", info_cuisine: "Known for Borscht (beet soup), Pelmeni (dumplings), and Beef Stroganoff." },
        { city: "Washington", city_tr: "Vaşington", country: "USA", coords: [-77.0369, 38.9072], hint_food: "images/ipucu-washington.png", hint_food_name: "Hamburger", hint_colors: ['#B22234', '#FFFFFF', '#3C3B6E'], flag_img: "images/flag-abd.png", info_history: "Capital of the USA. Home to the White House and Lincoln Memorial.", info_cuisine: "Local specialties include Crab Cakes and the 'Half-Smoke' sausage." },
        { city: "Mexico City", city_tr: "Meksiko", country: "Mexico", coords: [-99.1332, 19.4326], hint_food: "images/ipucu-mexico-city.png", hint_food_name: "Tacos al Pastor", hint_colors: ['#006847', '#FFFFFF', '#CE1126'], flag_img: "images/flag-meksika.png", info_history: "Built on the ancient Aztec capital, Tenochtitlan. Main square is the Zócalo.", info_cuisine: "UNESCO heritage cuisine. Famous for Tacos al Pastor and Quesadillas." },
        { city: "Brasilia", city_tr: "Brazilya", country: "Brazil", coords: [-47.8825, -15.7942], hint_food: "images/ipucu-brasilia.png", hint_food_name: "Feijoada", hint_colors: ['#009B3A', '#FFCC29', '#002776'], flag_img: "images/flag-brezilya.png", info_history: "A futuristic capital city planned and built in the 1950s by Oscar Niemeyer.", info_cuisine: "National dish 'Feijoada', 'Pão de Queijo' (cheese bread), and 'Churrasco' (BBQ)." },
        { city: "Buenos Aires", city_tr: "Buenos Aires", country: "Argentina", coords: [-58.3816, -34.6037], hint_food: "images/ipucu-buenos-aires.png", hint_food_name: "Empanada Pie", hint_colors: ['#75AADB', '#FFFFFF', '#FFB81C'], flag_img: "images/flag-arjantin.png", info_history: "'The Paris of South America'. The birthplace of Tango in La Boca.", info_cuisine: "World-famous beef and 'Asado' (barbecue). Try 'Empanadas' (pastries)." },
        { city: "Beijing", city_tr: "Pekin", country: "China", coords: [116.4074, 39.9042], hint_food: "images/ipucu-beijing.png", hint_food_name: "Peking Duck", hint_colors: ['#EE1C25', '#FFFF00'], flag_img: "images/flag-cin.png", info_history: "The imperial capital. Home to the Forbidden City and Tiananmen Square.", info_cuisine: "Most famous for 'Peking Duck'. 'Jiaozi' (dumplings) are also popular." },
        { city: "Canberra", city_tr: "Kanberra", country: "Australia", coords: [149.1300, -35.2809], hint_food: "images/ipucu-canberra.png", hint_food_name: "Steak", hint_colors: ['#00008B', '#FFFFFF', '#FF0000'], flag_img: "images/flag-avustralya.png", info_history: "A planned capital city, built to end the Sydney/Melbourne rivalry.", info_cuisine: "Try 'Barramundi' (fish) or 'Vegemite'. Kangaroo meat is also available." },
        { city: "Vienna", city_tr: "Viyana", country: "Austria", coords: [16.3738, 48.2082], hint_food: "images/ipucu-vienna.png", hint_food_name: "Salad Bowl", hint_colors: ['#ED2939', '#FFFFFF'], flag_img: "images/flag-avusturya.png", info_history: "Historic center is a UNESCO site. Home to classical music giants like Mozart and Beethoven.", info_cuisine: "Famous for Wiener Schnitzel, Apfelstrudel (apple strudel), and Sachertorte (chocolate cake)." },
        { city: "Prague", city_tr: "Prag", country: "Czechia", coords: [14.4378, 50.0755], hint_food: "images/ipucu-prague.png", hint_food_name: "Mixed Grill Plate", hint_colors: ['#FFFFFF', '#D7141A', '#11457E'], flag_img: "images/flag-cekya.png", info_history: "Home to the 600-year-old Astronomical Clock and the historic Charles Bridge.", info_cuisine: "Known for hearty Goulash (Guláš), 'Svíčková' (beef sirloin), and world-famous pilsner beer." },
        { city: "Seoul", city_tr: "Seul", country: "South Korea", coords: [126.9780, 37.5665], hint_food: "images/ipucu-seoul.png", hint_food_name: "Naengmyeon (Cold Noodles)", hint_colors: ['#FFFFFF', '#CD2E3A', '#0047A0', '#000000'], flag_img: "images/flag-guney-kore.png", info_history: "A 24/7 metropolis. Home to Gyeongbokgung Palace and modern K-Pop culture.", info_cuisine: "Famous for Kimchi (fermented vegetables), Bulgogi (grilled beef), and Bibimbap." },
        { city: "Amsterdam", city_tr: "Amsterdam", country: "Netherlands", coords: [4.8952, 52.3702], hint_food: "images/ipucu-amsterdam.png", hint_food_name: "Stamppot", hint_colors: ['#AE1C28', '#FFFFFF', '#21468B'], flag_img: "images/flag-hollanda.png", info_history: "Known for its canal system, the Rijksmuseum, and the Anne Frank House.", info_cuisine: "Try 'Stroopwafel' (syrup waffles), 'Haring' (raw herring), and various cheeses like Gouda." },
        { city: "Dublin", city_tr: "Dublin", country: "Ireland", coords: [-6.2603, 53.3498], hint_food: "images/ipucu-dublin.png", hint_food_name: "Irish Stew", hint_colors: ['#009A49', '#FFFFFF', '#FF7900'], flag_img: "images/flag-irlanda.png", info_history: "Founded by Vikings. Home of Guinness, Trinity College, and the Book of Kells.", info_cuisine: "Famous for Irish Stew, 'Colcannon' (potatoes and cabbage), and 'Boxty' (potato pancakes)." },
        { city: "Stockholm", city_tr: "Stokholm", country: "Sweden", coords: [18.0686, 59.3293], hint_food: "images/ipucu-stockholm.png", hint_food_name: "Almond Cake", hint_colors: ['#006AA7', '#FECC00'], flag_img: "images/flag-isvec.png", info_history: "Built on 14 islands. Home to the Nobel Prize ceremony and the Vasa Museum.", info_cuisine: "Known for 'Köttbullar' (meatballs), pickled herring, and 'Smörgåsbord'." },
        { city: "Ottawa", city_tr: "Ottava", country: "Canada", coords: [-75.6972, 45.4215], hint_food: "images/ipucu-ottawa.png", hint_food_name: "Poutine", hint_colors: ['#FF0000', '#FFFFFF'], flag_img: "images/flag-kanada.png", info_history: "Home to Parliament Hill and the Rideau Canal, which becomes a giant ice rink in winter.", info_cuisine: "Famous for 'Poutine' (fries, cheese curds, gravy) and 'BeaverTails' (pastry)." },
        { city: "Lisbon", city_tr: "Lizbon", country: "Portugal", coords: [-9.1393, 38.7223], hint_food: "images/ipucu-lisbon.png", hint_food_name: "Pastel de Nata", hint_colors: ['#006241', '#FF0000', '#FEE500'], flag_img: "images/flag-portekiz.png", info_history: "One of the oldest cities in Western Europe. Known for its Fado music and historic trams.", info_cuisine: "Famous for 'Pastel de Nata' (custard tart), 'Bacalhau' (codfish), and Piri-piri chicken." },
        { city: "Bangkok", city_tr: "Bangkok", country: "Thailand", coords: [100.5018, 13.7563], hint_food: "images/ipucu-bangkok.png", hint_food_name: "Pad Thai", hint_colors: ['#A51931', '#FFFFFF', '#2D2A4A'], flag_img: "images/flag-tayland.png", info_history: "Known for the Grand Palace and Wat Arun temple. Its full name is one of the longest in the world.", info_cuisine: "World-famous street food. Home of 'Pad Thai' (stir-fried noodles) and 'Tom Yum Goong' (spicy shrimp soup)." },
        { city: "Athens", city_tr: "Atina", country: "Greece", coords: [23.7275, 37.9838], hint_food: "images/ipucu-athens.png", hint_food_name: "Greek Salad", hint_colors: ['#0D5EAF', '#FFFFFF'], flag_img: "images/flag-yunanistan.png", info_history: "The cradle of Western civilization and democracy. Home to the Acropolis and the Parthenon.", info_cuisine: "Known for 'Moussaka' (eggplant bake), 'Souvlaki' (grilled meat skewers), and 'Choriatiki' (Greek salad)." }
    ];
   
    // --- DOM ELEMENTLERİNİ ALMA ---
    const startMenu = document.getElementById('start-menu');
    const btnStartGame = document.getElementById('btn-start-game');
    const mapElement = document.getElementById('map');
    const gameUI = document.getElementById('game-ui');
    const guessInput = document.getElementById('guess-input');
    const suggestionsList = document.getElementById('suggestions-list');
    const btnGuess = document.getElementById('btn-guess');
    const btnHintFood = document.getElementById('btn-hint-food');
    const btnHintColors = document.getElementById('btn-hint-colors');
    const popupOverlay = document.getElementById('popup-overlay');
    const popupTitle = document.getElementById('popup-title');
    const popupContent = document.getElementById('popup-content');
    const btnPopupClose = document.getElementById('btn-popup-close');
    const btnSettings = document.getElementById('btn-settings');
    const settingsOverlay = document.getElementById('settings-overlay');
    const btnSettingsClose = document.getElementById('btn-settings-close');
    const brightnessOverlay = document.getElementById('brightness-overlay');
    const sliderBrightness = document.getElementById('slider-brightness');
    const sliderMusic = document.getElementById('slider-music');
    const sliderEffects = document.getElementById('slider-effects');
    const mapTypeButtons = document.querySelectorAll('.map-type-btn');
    // YENİ DOM ELEMENTLERİ
    const lifeHeartsEl = document.getElementById('life-hearts');
    const timerCountEl = document.getElementById('timer-count');
    const summaryScreen = document.getElementById('summary-screen');
    const summaryTitle = document.getElementById('summary-title');
    const summaryReason = document.getElementById('summary-reason');
    const sumScoreEl = document.getElementById('sum-score');
    const sumTimeEl = document.getElementById('sum-time');
    const sumHintsEl = document.getElementById('sum-hints');
    const wrongAnswersList = document.getElementById('wrong-answers-list');
    const btnRestart = document.getElementById('btn-restart');
    const btnMainMenu = document.getElementById('btn-main-menu');

    // --- SES DOSYALARI ---
    const sfxCorrect = new Audio('audio/correct-answer.mp3');
    const sfxWrong = new Audio('audio/wrong-answer.mp3');
    const sfxPlane = new Audio('audio/plane-fly.mp3');
    const sfxHint = new Audio('audio/ipucu-ses.mp3');
    const sfxButtonClick = new Audio('audio/button-click.mp3');
    const sfxAnnouncement = new Audio('audio/anons.mp3');

    // --- OYUN DURUMU DEĞİŞKENLERİ ---
    let currentLevel = 0;
    let playerTokens = 20;
    let map;
    let gameLayer;
    let playerPawn;
    let isAnimating = false;
    let mainMapLayer;
    let summaryChart = null;
    
    // İSTATİSTİK VE DURUM DEĞİŞKENLERİ
    let playerLives = 3;
    let timeLeft = 120; 
    let timerInterval;
    let totalScore = 0;
    let hintsUsed = 0;
    let wrongAnswers = [];
    let currentFocus = -1;
   
    // Harita Kaynakları
    const cartoDarkSource = new ol.source.XYZ({ url: 'https://{a-c}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}.png', attributions: '© OpenStreetMap contributors, © CARTO' });
    const cartoLightSource = new ol.source.XYZ({ url: 'https://{a-c}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png', attributions: '© OpenStreetMap contributors, © CARTO' });
    const satelliteSource = new ol.source.XYZ({ url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', attributions: '© Esri, HERE, Garmin, USGS, NGA' });
   
    // --- BAŞLANGIÇ SES SEVİYELERİ ---
    sfxCorrect.volume = sliderEffects.value / 100;
    sfxWrong.volume = sliderEffects.value / 100;
    sfxPlane.volume = sliderEffects.value / 100;
    sfxHint.volume = sliderEffects.value / 100;
    sfxButtonClick.volume = sliderEffects.value / 100;
    sfxAnnouncement.volume = sliderEffects.value / 100;
   
    // --- HARİTA KURULUMU ---
    function initializeGame() {
        mainMapLayer = new ol.layer.Tile({ source: satelliteSource });
        const playerStyle = new ol.style.Style({
            image: new ol.style.Icon({ anchor: [0.5, 0.5], src: 'images/plane-icon.png', scale: 0.1, rotateWithView: true })
        });
        playerPawn = new ol.Feature();
        playerPawn.setStyle(playerStyle);
        gameLayer = new ol.layer.Vector({
            source: new ol.source.Vector({ features: [playerPawn] }),
            zIndex: 10
        });
        map = new ol.Map({
            target: 'map',
            layers: [ mainMapLayer, gameLayer ],
            view: new ol.View({ center: ol.proj.fromLonLat([10, 30]), zoom: 2 }),
        });
    }

    // --- OYUN FONKSİYONLARI ---
    function loadLevel(levelIndex, skipAnimation = false) {
        let levelData = gameData[levelIndex];
        currentLevel = levelIndex;
        const levelCountEl = document.getElementById('level-count');
        if (levelCountEl) levelCountEl.textContent = levelIndex + 1;
        guessInput.value = "";
        updateTokenUI();
        const levelCoords = ol.proj.fromLonLat(levelData.coords);
        if (!playerPawn.getGeometry()) {
            playerPawn.setGeometry(new ol.geom.Point(levelCoords));
        } else {
            playerPawn.getGeometry().setCoordinates(levelCoords);
        }
        if (!skipAnimation) {
            map.getView().animate({
                center: levelCoords,
                zoom: 6,
                duration: 2000
            });
        }
    }

    function updateTokenUI() {
        const tokenCountEl = document.getElementById('token-count');
        if (tokenCountEl) {
            tokenCountEl.textContent = playerTokens;
        }
        btnHintFood.disabled = (playerTokens < 10);
        btnHintColors.disabled = (playerTokens < 10);
    }

    function showPopup(title, contentHTML, buttonText = "Close") {
        popupTitle.innerHTML = title;
        popupContent.innerHTML = contentHTML;
        btnPopupClose.textContent = buttonText;
        popupOverlay.style.display = 'flex';
        popupOverlay.style.pointerEvents = 'all';
        gsap.to(popupOverlay, { duration: 0.3, opacity: 1 });
        
        btnPopupClose.onclick = () => {
            playClickSound();
            hidePopup();
        };
    }
    function hidePopup() {
        gsap.to(popupOverlay, { duration: 0.3, opacity: 0, onComplete: () => {
            popupOverlay.style.display = 'none';
            popupOverlay.style.pointerEvents = 'none';
        }});
    }

    // --- OTOMATİK TAMAMLAMA FONKSİYONLARI ---
    function showSuggestions(inputVal) {
        suggestionsList.innerHTML = ''; 
        currentFocus = -1; 
        if (inputVal.length < 1) {
            suggestionsList.style.display = 'none';
            return;
        }
        const filtered = allCapitals.filter(capital => 
            capital.toLowerCase().startsWith(inputVal.toLowerCase())
        );
        if (filtered.length > 0) {
            filtered.forEach(capital => {
                const li = document.createElement('li');
                li.textContent = capital;
                li.addEventListener('click', () => {
                    guessInput.value = capital;
                    suggestionsList.style.display = 'none';
                    checkGuess(); 
                });
                suggestionsList.appendChild(li);
            });
            suggestionsList.style.display = 'block';
        } else {
            suggestionsList.style.display = 'none';
        }
    }

    function addActive(items) {
        if (!items) return false;
        removeActive(items);
        if (currentFocus >= items.length) currentFocus = 0;
        if (currentFocus < 0) currentFocus = (items.length - 1);
        items[currentFocus].classList.add("suggestion-active");
        items[currentFocus].scrollIntoView({ block: "nearest" });
    }

    function removeActive(items) {
        for (let i = 0; i < items.length; i++) {
            items[i].classList.remove("suggestion-active");
        }
    }

    // --- ZAMANLAYICI VE OYUN SONU ---
    function startTimer() {
        clearInterval(timerInterval);
        timerInterval = setInterval(() => {
            timeLeft--;
            updateTimerUI();
            if (timeLeft <= 0) {
                gameOver("Time's up!");
            }
        }, 1000);
    }

    function stopTimer() {
        clearInterval(timerInterval);
    }

    function updateTimerUI() {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        timerCountEl.textContent = timeString;
        if (timeLeft <= 30) {
            timerCountEl.style.color = '#FF4136';
        } else {
            timerCountEl.style.color = '#fff';
        }
        return timeString; 
    }

    function updateLifeUI() {
        lifeHeartsEl.textContent = '💛'.repeat(playerLives);
    }

    function gameOver(reason, isVictory = false) {
        stopTimer();
        sfxPlane.pause();
        
        if (isVictory) {
            sfxCorrect.play();
            launchConfetti(); 
            summaryTitle.textContent = "MISSION COMPLETE!";
            summaryTitle.className = "success"; 
        } else {
            sfxWrong.play();
            summaryTitle.textContent = "GAME OVER";
            summaryTitle.className = "fail"; 
        }

        summaryReason.textContent = reason;
        sumScoreEl.textContent = totalScore + playerTokens;
        sumTimeEl.textContent = updateTimerUI(); 
        sumHintsEl.textContent = hintsUsed;

        wrongAnswersList.innerHTML = ""; 
        if (wrongAnswers.length > 0) {
            wrongAnswers.forEach(city => {
                const li = document.createElement('li');
                li.textContent = city;
                wrongAnswersList.appendChild(li);
            });
        } else {
            const li = document.createElement('li');
            li.textContent = "None! Perfect game.";
            li.style.color = "#2ECC40";
            li.style.listStyle = "none";
            wrongAnswersList.appendChild(li);
        }

        // --- CHART.JS GRAFİK OLUŞTURMA (GECİKMELİ) ---
        summaryScreen.style.opacity = 0;
        summaryScreen.style.display = 'flex';
        summaryScreen.style.pointerEvents = 'all';

        setTimeout(() => {
             const ctx = document.getElementById('summaryChart').getContext('2d');
             if (summaryChart) { summaryChart.destroy(); }
             
             const correctCount = isVictory ? currentLevel + 1 : currentLevel;
             const wrongCount = wrongAnswers.length;

             summaryChart = new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: ['Correct Guesses', 'Wrong Attempts'],
                    datasets: [{
                        data: [correctCount, wrongCount],
                        backgroundColor: ['#2ECC40', '#FF4136'],
                        borderColor: '#1a1a1a',
                        borderWidth: 2
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'bottom',
                            labels: { color: '#f0f0f0', font: { family: "'Inter', sans-serif", size: 14 } }
                        }
                    }
                }
            });
        }, 50);

        gsap.to(summaryScreen, { duration: 0.5, opacity: 1 });
        gameUI.style.pointerEvents = 'none';
        gsap.to(gameUI, { duration: 0.5, opacity: 0 });
    }

    // --- BONUS: KONFETİ EFEKTİ ---
    function launchConfetti() {
        var duration = 3 * 1000;
        var animationEnd = Date.now() + duration;
        var defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 4000 };
        function randomInRange(min, max) { return Math.random() * (max - min) + min; }
        var interval = setInterval(function() {
          var timeLeft = animationEnd - Date.now();
          if (timeLeft <= 0) { return clearInterval(interval); }
          var particleCount = 50 * (timeLeft / duration);
          confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } }));
          confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } }));
        }, 250);
    }

    function checkGuess() {
        if (isAnimating) return;
        
        const levelData = gameData[currentLevel];
        const answer_en = levelData.city.toLowerCase();
        const answer_tr = levelData.city_tr.toLowerCase();
        const guess = guessInput.value.trim().toLowerCase();
        
        if (guess === answer_en || guess === answer_tr) {
            sfxCorrect.play();
            playerTokens += 5;
            totalScore += 100; 
            timeLeft += 10;    
            updateTokenUI();
            updateTimerUI();

            if (currentLevel >= gameData.length - 1) {
                gameOver("You traveled the whole world!", true);
                return;
            }

            const infoCardHTML = `
                <div class="info-card">
                    <img src="${levelData.flag_img}" class="info-flag" alt="${levelData.country} Flag">
                    <h3>${levelData.city}, ${levelData.country}</h3>
                    <p class="info-tokens">+5 Tokens | +100 Score | +10s Time</p>
                    <p class="info-text">${levelData.info_history}</p>
                    <p class="info-text">${levelData.info_cuisine}</p>
                </div>
            `;
            showPopup("Correct!", infoCardHTML, "Great, keep going!");
            
            isAnimating = true;
            sfxPlane.play();
            const nextLevelIndex = currentLevel + 1;
            const startCoords = ol.proj.fromLonLat(gameData[currentLevel].coords);
            const endCoords = ol.proj.fromLonLat(gameData[nextLevelIndex].coords);
            const dx = endCoords[0] - startCoords[0];
            const dy = endCoords[1] - startCoords[1];
            const rotation = Math.atan2(dy, dx);
            const olRotation = -rotation + (Math.PI / 2);
            playerPawn.getStyle().getImage().setRotation(olRotation);
            const flightPathLine = new ol.Feature({ geometry: new ol.geom.LineString([startCoords, startCoords]) });
            flightPathLine.setStyle(new ol.style.Style({ stroke: new ol.style.Stroke({ color: 'rgba(255, 193, 7, 0.4)', width: 4 }) }));
            gameLayer.getSource().addFeature(flightPathLine);
            let animProgress = { x: startCoords[0], y: startCoords[1] };
            gsap.to(animProgress, {
                duration: 5.0,
                x: endCoords[0],
                y: endCoords[1],
                onUpdate: function() {
                    const currentFlightCoords = [animProgress.x, animProgress.y];
                    playerPawn.getGeometry().setCoordinates(currentFlightCoords);
                    flightPathLine.getGeometry().setCoordinates([startCoords, currentFlightCoords]);
                    map.getView().setCenter(currentFlightCoords);
                },
                onComplete: function() {
                    sfxPlane.pause();
                    sfxPlane.currentTime = 0;
                    map.getView().animate({ zoom: 6, duration: 500 });
                    setTimeout(() => {
                        hidePopup();
                        loadLevel(nextLevelIndex, true);
                        isAnimating = false;
                    }, 500);
                }
            });
        } else {
            sfxWrong.play();
            playerLives--;
            updateLifeUI();
            wrongAnswers.push(`${levelData.city} (${levelData.country})`);
            if (playerLives <= 0) {
                gameOver("Out of lives!");
            } else {
                showPopup("Incorrect!", `<p>Careful! ${playerLives} lives remaining.</p>`);
            }
        }
    }

    function shuffleGameData(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        array.forEach((item, index) => {
            item.level = index + 1;
        });
    }

    function showSettings() {
        settingsOverlay.style.display = 'flex';
        settingsOverlay.style.pointerEvents = 'all';
        gsap.to(settingsOverlay, { duration: 0.3, opacity: 1 });
    }
    function hideSettings() {
        gsap.to(settingsOverlay, { duration: 0.3, opacity: 0, onComplete: () => {
            settingsOverlay.style.display = 'none';
            settingsOverlay.style.pointerEvents = 'none';
        }});
    }

    function playClickSound() {
        sfxButtonClick.currentTime = 0;
        sfxButtonClick.play();
    }

    // --- OLAY DİNLEYİCİLERİ ---
    btnStartGame.addEventListener('click', () => {
        playClickSound();
        sfxAnnouncement.play();
        currentLevel = 0;
        playerTokens = 20;
        playerLives = 3;
        timeLeft = 120;
        totalScore = 0;
        hintsUsed = 0;
        wrongAnswers = [];
        updateTokenUI();
        updateLifeUI();
        updateTimerUI();
        startTimer();
        gsap.to(startMenu, { duration: 0.5, opacity: 0, onComplete: () => { startMenu.style.display = 'none'; startMenu.style.pointerEvents = 'none'; } });
        gameUI.style.display = 'flex';
        gameUI.style.pointerEvents = 'all';
        gsap.to(gameUI, { duration: 0.5, opacity: 1, delay: 0.5 });
        shuffleGameData(gameData);
        const totalLevelsEl = document.getElementById('total-levels');
        if (totalLevelsEl) { totalLevelsEl.textContent = gameData.length; }
        loadLevel(0, false);
    });

    btnGuess.addEventListener('click', checkGuess);
    
    guessInput.addEventListener('keydown', (e) => {
        let items = suggestionsList.getElementsByTagName('li');
        if (e.key === 'ArrowDown') {
            currentFocus++;
            addActive(items);
        } else if (e.key === 'ArrowUp') {
            currentFocus--;
            addActive(items);
        } else if (e.key === 'Enter') {
            if (suggestionsList.style.display === 'block' && currentFocus > -1) {
                e.preventDefault();
                if (items[currentFocus]) {
                    items[currentFocus].click(); 
                }
            } else {
                checkGuess();
            }
        }
    });

    guessInput.addEventListener('input', (e) => {
        showSuggestions(e.target.value);
    });
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.input-wrapper')) {
            suggestionsList.style.display = 'none';
        }
    });

    btnPopupClose.addEventListener('click', hidePopup);

    btnHintFood.addEventListener('click', () => {
        if (playerTokens >= 10) {
            sfxHint.play();
            sfxHint.currentTime = 0;
            playerTokens -= 10;
            hintsUsed++;
            updateTokenUI();
            const levelData = gameData[currentLevel];
            const hintHTML = `<div class="hint-food-popup"><img src="${levelData.hint_food}" alt="Food Hint"><p>${levelData.hint_food_name}</p></div>`;
            showPopup("Hint: Local Food", hintHTML);
        }
    });

    btnHintColors.addEventListener('click', () => {
        if (playerTokens >= 10) {
            sfxHint.play();
            sfxHint.currentTime = 0;
            playerTokens -= 10;
            hintsUsed++;
            updateTokenUI();
            let colorHTML = '<div class="color-swatches">';
            gameData[currentLevel].hint_colors.forEach(color => { colorHTML += `<div class="color-swatch" style="background-color: ${color};"></div>`; });
            colorHTML += '</div>';
            showPopup("Hint: Flag Colors", colorHTML);
        }
    });

    btnSettings.addEventListener('click', () => { playClickSound(); showSettings(); });
    btnSettingsClose.addEventListener('click', () => { playClickSound(); hideSettings(); });
    sliderBrightness.addEventListener('input', (e) => { brightnessOverlay.style.opacity = (1 - e.target.value) * 0.7; });
    sliderEffects.addEventListener('input', (e) => {
        const v = e.target.value / 100;
        sfxCorrect.volume = v; sfxWrong.volume = v; sfxPlane.volume = v; sfxHint.volume = v; sfxButtonClick.volume = v; sfxAnnouncement.volume = v;
    });
    mapTypeButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            playClickSound();
            mapTypeButtons.forEach(btn => btn.classList.remove('active'));
            e.target.classList.add('active');
            switch (e.target.dataset.map) {
                case 'light': mainMapLayer.setSource(cartoLightSource); break;
                case 'satellite': mainMapLayer.setSource(satelliteSource); break;
                default: mainMapLayer.setSource(cartoDarkSource); break;
            }
        });
    });

    btnRestart.addEventListener('click', () => {
        playClickSound();
        gsap.to(summaryScreen, { duration: 0.3, opacity: 0, onComplete: () => { summaryScreen.style.display = 'none'; }});
        btnStartGame.click(); 
    });
    btnMainMenu.addEventListener('click', () => { playClickSound(); window.location.reload(); });

    initializeGame();

}; // window.onload sonu