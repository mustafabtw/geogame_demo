// 'window.onload' sarmalayıcısı, tüm kütüphanelerin yüklenmesini bekler.
window.onload = function() {

    // --- OYUN VERİTABANI (15 Seviye) ---
    const gameData = [
        { level: 1, city: "Paris", coords: [2.3522, 48.8566], hint_food: "images/ipucu-paris.png", hint_colors: ['#0055A4', '#FFFFFF', '#EF4135'] },
        { level: 2, city: "Tokyo", coords: [139.6917, 35.6895], hint_food: "images/ipucu-tokyo.png", hint_colors: ['#FFFFFF', '#BC002D'] },
        { level: 3, city: "Cairo", coords: [31.2357, 30.0444], hint_food: "images/ipucu-cairo.png", hint_colors: ['#CE1126', '#FFFFFF', '#000000'] },
        { level: 4, city: "Ankara", coords: [32.8597, 39.9334], hint_food: "images/ipucu-ankara.png", hint_colors: ['#E30A17', '#FFFFFF'] },
        { level: 5, city: "Rome", coords: [12.4964, 41.9028], hint_food: "images/ipucu-rome.png", hint_colors: ['#008C45', '#F4F5F0', '#CD212A'] },
        { level: 6, city: "London", coords: [-0.1276, 51.5072], hint_food: "images/ipucu-london.png", hint_colors: ['#012169', '#FFFFFF', '#C8102E'] },
        { level: 7, city: "Berlin", coords: [13.4050, 52.5200], hint_food: "images/ipucu-berlin.png", hint_colors: ['#000000', '#DD0000', '#FFCC00'] },
        { level: 8, city: "Madrid", coords: [-3.7038, 40.4168], hint_food: "images/ipucu-madrid.png", hint_colors: ['#AA151B', '#F1B53B'] },
        { level: 9, city: "Moscow", coords: [37.6173, 55.7558], hint_food: "images/ipucu-moscow.png", hint_colors: ['#FFFFFF', '#0039A6', '#D52B1E'] },
        { level: 10, city: "Washington", coords: [-77.0369, 38.9072], hint_food: "images/ipucu-washington.png", hint_colors: ['#B22234', '#FFFFFF', '#3C3B6E'] },
        { level: 11, city: "Mexico City", coords: [-99.1332, 19.4326], hint_food: "images/ipucu-mexico-city.png", hint_colors: ['#006847', '#FFFFFF', '#CE1126'] },
        { level: 12, city: "Brasilia", coords: [-47.8825, -15.7942], hint_food: "images/ipucu-brasilia.png", hint_colors: ['#009B3A', '#FFCC29', '#002776'] },
        { level: 13, city: "Buenos Aires", coords: [-58.3816, -34.6037], hint_food: "images/ipucu-buenos-aires.png", hint_colors: ['#75AADB', '#FFFFFF', '#FFB81C'] },
        { level: 14, city: "Beijing", coords: [116.4074, 39.9042], hint_food: "images/ipucu-beijing.png", hint_colors: ['#EE1C25', '#FFFF00'] },
        { level: 15, city: "Canberra", coords: [149.1300, -35.2809], hint_food: "images/ipucu-canberra.png", hint_colors: ['#00008B', '#FFFFFF', '#FF0000'] }
    ];

    // Oyunu karıştırma fonksiyonunu çağır
    shuffleGameData(gameData);

    // --- DOM ELEMENTLERİNİ ALMA ---
    // ... (Elementler değişmedi) ...
    const startMenu = document.getElementById('start-menu');
    const btnStartGame = document.getElementById('btn-start-game');
    const mapElement = document.getElementById('map');
    const gameUI = document.getElementById('game-ui');
    const levelCountEl = document.getElementById('level-count');
    const tokenCountEl = document.getElementById('token-count');
    const guessInput = document.getElementById('guess-input');
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
    
    // === SES 1: Ses dosyalarını yükle (Güncellendi) ===
    // (Arka plan müziği olmadığı için onu kaldırdım, istersen ekleriz)
    const sfxCorrect = new Audio('audio/correct-answer.mp3');
    const sfxWrong = new Audio('audio/wrong-answer.mp3');
    const sfxPlane = new Audio('audio/plane-fly.mp3');
    const sfxHint = new Audio('audio/ipucu-ses.mp3');

    // Uçak sesi 5 saniyelik uçuşla eşleşmiyor olabilir, loop (döngü) açmak daha güvenli.
    // sfxPlane.loop = true; // İsteğe bağlı: Uçuş sesi animasyondan kısaysa bunu aç
    // === /SES 1 ===


    // --- OYUN DURUMU DEĞİŞKENLERİ ---
    // ... (Bu kısım değişmedi) ...
    let currentLevel = 0; 
    let playerTokens = 20;
    let map; 
    let gameLayer; 
    let playerPawn; 
    let isAnimating = false;
    let mainMapLayer;
    const cartoDarkSource = new ol.source.XYZ({
        url: 'https://{a-c}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}.png',
        attributions: '© OpenStreetMap contributors, © CARTO'
    });
    const cartoLightSource = new ol.source.XYZ({
        url: 'https://{a-c}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png',
        attributions: '© OpenStreetMap contributors, © CARTO'
    });
    const satelliteSource = new ol.source.XYZ({
        url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        attributions: '© Esri, HERE, Garmin, USGS, NGA'
    });
    

    // === SES 2: Başlangıç Ses Seviyelerini Ayarla (Güncellendi) ===
    // Slider'ların varsayılan değerini (örn: 90) al ve ses objelerine uygula
    sfxCorrect.volume = sliderEffects.value / 100;
    sfxWrong.volume = sliderEffects.value / 100;
    sfxPlane.volume = sliderEffects.value / 100;
    sfxHint.volume = sliderEffects.value / 100;
    
    // Müziği şimdilik kapattık, slider'ı gizleyebilir veya bırakabiliriz.
    // musicAudio.volume = sliderMusic.value / 100;
    // === /SES 2 ===


    // --- HARİTA VE OYUN KURULUM FONKSİYONU ---
    // ... (initializeGame fonksiyonu değişmedi) ...
    function initializeGame() {
        mainMapLayer = new ol.layer.Tile({
            source: cartoDarkSource
        });

        const playerStyle = new ol.style.Style({
            image: new ol.style.Icon({
                anchor: [0.5, 0.5], 
                src: 'images/plane-icon.png', 
                scale: 0.1, 
                rotateWithView: true
            })
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
            view: new ol.View({
                center: ol.proj.fromLonLat([10, 30]),
                zoom: 2, 
            }),
        });
    }

    // --- OYUN FONKSİYONLARI ---
    // ... (loadLevel, updateTokenUI, showPopup, hidePopup fonksiyonları değişmedi) ...
    function loadLevel(levelIndex, skipAnimation = false) {
        // ...
        const level = gameData[levelIndex];
        currentLevel = levelIndex;
        levelCountEl.textContent = level.level;
        guessInput.value = "";
        updateTokenUI();
        const levelCoords = ol.proj.fromLonLat(level.coords);
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
        // ...
        tokenCountEl.textContent = playerTokens;
        btnHintFood.disabled = (playerTokens < 10);
        btnHintColors.disabled = (playerTokens < 10);
    }
    function showPopup(title, contentHTML) {
        // ...
        popupTitle.innerHTML = title;
        popupContent.innerHTML = contentHTML;
        popupOverlay.style.display = 'flex';
        popupOverlay.style.pointerEvents = 'all';
        gsap.to(popupOverlay, { duration: 0.3, opacity: 1 });
    }
    function hidePopup() {
        // ...
        gsap.to(popupOverlay, { duration: 0.3, opacity: 0, onComplete: () => {
            popupOverlay.style.display = 'none';
            popupOverlay.style.pointerEvents = 'none';
        }});
    }

    // === SES 3: checkGuess Fonksiyonunu UÇAK SESİ ile Güncelle ===
    function checkGuess() {
        if (isAnimating) return; 

        const answer = gameData[currentLevel].city.toLowerCase();
        const guess = guessInput.value.trim().toLowerCase();
        
        if (guess === answer) {
            sfxCorrect.play(); // DOĞRU CEVAP SESİ
            playerTokens += 5;
            showPopup("Doğru!", `<p>Tebrikler! +5 Jeton kazandın.</p>`);
            
            if (currentLevel < gameData.length - 1) {
                isAnimating = true; 
                sfxPlane.play(); // UÇAK SESİNİ BAŞLAT
                
                const nextLevelIndex = currentLevel + 1;
                const startCoords = ol.proj.fromLonLat(gameData[currentLevel].coords);
                const endCoords = ol.proj.fromLonLat(gameData[nextLevelIndex].coords);
                // ... (Rotasyon ve çizgi kodları) ...
                const dx = endCoords[0] - startCoords[0];
                const dy = endCoords[1] - startCoords[1];
                const rotation = Math.atan2(dy, dx);
                const olRotation = -rotation + (Math.PI / 2);
                playerPawn.getStyle().getImage().setRotation(olRotation);
                const flightPathLine = new ol.Feature({
                    geometry: new ol.geom.LineString([startCoords, startCoords])
                });
                flightPathLine.setStyle(new ol.style.Style({
                    stroke: new ol.style.Stroke({
                        color: 'rgba(255, 193, 7, 0.4)',
                        width: 4
                    })
                }));
                gameLayer.getSource().addFeature(flightPathLine);
                // ... (GSAP Animasyonu) ...
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
                        // === SES 3.1: Uçak sesini durdur ===
                        sfxPlane.pause(); // Sesi durdur
                        sfxPlane.currentTime = 0; // Sesi başa sar
                        // === /SES 3.1 ===
                        
                        map.getView().animate({ zoom: 6, duration: 500 });
                        setTimeout(() => {
                            hidePopup();
                            loadLevel(nextLevelIndex, true); 
                            isAnimating = false;
                        }, 500);
                    }
                });

            } else {
                showPopup("Oyun Bitti!", "<p>Tüm seviyeleri tamamladın!</p>");
                btnGuess.disabled = true;
            }
        } else {
            sfxWrong.play(); // YANLIŞ CEVAP SESİ
            showPopup("Yanlış!", "<p>Tekrar dene. İpucu kullanmak ister misin?</p>");
        }
    }
    // === /SES 3 ===

    // ... (shuffleGameData fonksiyonu değişmedi) ...
    function shuffleGameData(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        array.forEach((item, index) => {
            item.level = index + 1;
        });
    }

    // ... (showSettings, hideSettings fonksiyonları değişmedi) ...
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

    // --- OLAY DİNLEYİCİLERİ ---

    // === SES 4: Müziği Başlatma ===
    // (Müziğimiz olmadığı için bu butondaki .play() komutunu kaldırdık)
    btnStartGame.addEventListener('click', () => {
        // musicAudio.play(); // Kaldırıldı

        gsap.to(startMenu, { duration: 0.5, opacity: 0, onComplete: () => {
            startMenu.style.display = 'none';
        }});
        gameUI.style.display = 'flex';
        gameUI.style.pointerEvents = 'all';
        gsap.to(gameUI, { duration: 0.5, opacity: 1, delay: 0.5 });
        loadLevel(0, false);
    });

    btnGuess.addEventListener('click', checkGuess);
    btnPopupClose.addEventListener('click', hidePopup);

    // === SES 5: İpucu Butonlarına Ses Ekle ===
    btnHintFood.addEventListener('click', () => {
        if (playerTokens >= 10) {
            sfxHint.play(); // İPUCU SESİ
            sfxHint.currentTime = 0; // Sesi başa sar (ard arda basılabilmesi için)
            playerTokens -= 10;
            updateTokenUI();
            const hintImage = gameData[currentLevel].hint_food;
            showPopup("İpucu: Yöresel Yemek", `<img src="${hintImage}" alt="Yemek İpucu">`);
        }
    });

    btnHintColors.addEventListener('click', () => {
        if (playerTokens >= 10) {
            sfxHint.play(); // İPUCU SESİ
            sfxHint.currentTime = 0; // Sesi başa sar
            playerTokens -= 10;
            updateTokenUI();
            const hintColors = gameData[currentLevel].hint_colors;
            let colorHTML = '<div class="color-swatches">';
            hintColors.forEach(color => {
                colorHTML += `<div class="color-swatch" style="background-color: ${color};"></div>`;
            });
            colorHTML += '</div>';
            showPopup("İpucu: Bayrak Renkleri", colorHTML);
        }
    });
    // === /SES 5 ===


    // === SES 6: Slider'ları Ses Objelerine Bağla (Güncellendi) ===
    btnSettings.addEventListener('click', showSettings);
    btnSettingsClose.addEventListener('click', hideSettings);

    // Parlaklık slider'ı
    sliderBrightness.addEventListener('input', (e) => {
        brightnessOverlay.style.opacity = (1 - e.target.value) * 0.7;
    });

    // Müzik slider'ı
    sliderMusic.addEventListener('input', (e) => {
        // Müzik dosyamız yok, ancak ileride eklersek diye kodu bırakıyorum:
        // musicAudio.volume = e.target.value / 100;
        console.log("Müzik Sesi:", e.target.value);
    });

    // Efekt slider'ı (Tüm efektleri kapsayacak şekilde güncellendi)
    sliderEffects.addEventListener('input', (e) => {
        const effectVolume = e.target.value / 100;
        sfxCorrect.volume = effectVolume;
        sfxWrong.volume = effectVolume;
        sfxPlane.volume = effectVolume;
        sfxHint.volume = effectVolume;
    });
    // === /SES 6 ===

    // Harita Tipi butonları (değişmedi)
    mapTypeButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const mapName = e.target.dataset.map;
            mapTypeButtons.forEach(btn => btn.classList.remove('active'));
            e.target.classList.add('active');
            switch (mapName) {
                case 'light': mainMapLayer.setSource(cartoLightSource); break;
                case 'satellite': mainMapLayer.setSource(satelliteSource); break;
                case 'dark': default: mainMapLayer.setSource(cartoDarkSource); break;
            }
        });
    });

    // Haritayı ana menü için hemen yükle
    initializeGame();

}; // window.onload sarmalayıcısının sonu