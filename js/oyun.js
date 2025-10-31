// 'window.onload' sarmalayıcısı, tüm kütüphanelerin yüklenmesini bekler.
window.onload = function() {

    // --- OYUN VERİTABANI ---
    const gameData = [
        {
            level: 1,
            city: "Paris",
            coords: [2.3522, 48.8566],
            hint_food: "images/ipucu-kruvasan.png",
            hint_colors: ['#0055A4', '#FFFFFF', '#EF4135'] 
        },
        {
            level: 2,
            city: "Tokyo",
            coords: [139.6917, 35.6895],
            hint_food: "images/ipucu-sushi.png",
            hint_colors: ['#FFFFFF', '#BC002D']
        },
        {
            level: 3,
            city: "Cairo", 
            coords: [31.2357, 30.0444],
            hint_food: "images/ipucu-koshari.png",
            hint_colors: ['#CE1126', '#FFFFFF', '#000000']
        },
        {
            level: 4,
            city: "Ankara",
            coords: [32.8597, 39.9334],
            hint_food: "images/ipucu-simit.png",
            hint_colors: ['#E30A17', '#FFFFFF']
        }
        // ... 25 seviyeye kadar eklenecek
    ];

    // --- DOM ELEMENTLERİNİ ALMA ---
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

    // --- OYUN DURUMU DEĞİŞKENLERİ ---
    let currentLevel = 0; 
    let playerTokens = 20;
    let map; 
    let gameLayer; 
    let playerPawn; // Bu artık bizim UÇAĞIMIZ olacak
    let isAnimating = false; // Uçuş animasyonu sırasında tıklamaları engellemek için

    // --- HARİTA VE OYUN KURULUM FONKSİYONU ---
    function initializeGame() {
        
        const cartoDarkLayer = new ol.layer.Tile({
            source: new ol.source.XYZ({
                url: 'https://{a-c}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}.png',
                attributions: '© OpenStreetMap contributors, © CARTO'
            })
        });

        // === DEĞİŞİKLİK 1: Uçak Stili ===
        // Beyaz nokta yerine uçak ikonu kullanıyoruz.
        // İkonunuzun burnunun YUKARI (kuzeye) baktığından emin olun.
        const playerStyle = new ol.style.Style({
            image: new ol.style.Icon({
                anchor: [0.5, 0.5], // İkonu ortala
                src: 'images/plane-icon.png', // <-- KENDİ UÇAK İKONUNUZUN YOLU
                scale: 0.1, // İkon boyutunu ayarlayın
                rotateWithView: true // Harita dönerse dönsün (opsiyonel)
            })
        });
        
        // Piyonu (uçağı) geometrisiz (konumsuz) başlat
        playerPawn = new ol.Feature(); 
        playerPawn.setStyle(playerStyle);

        gameLayer = new ol.layer.Vector({
            source: new ol.source.Vector({ features: [playerPawn] }),
            zIndex: 10 
        });

        map = new ol.Map({
            target: 'map',
            layers: [ cartoDarkLayer, gameLayer ],
            view: new ol.View({
                center: ol.proj.fromLonLat([10, 30]),
                zoom: 2, 
            }),
        });
    }

    // --- OYUN FONKSİYONLARI ---
    
    // === DEĞİŞİKLİK 2: Fonksiyon Güncellendi ===
    // 'skipAnimation' parametresi eklendi.
    function loadLevel(levelIndex, skipAnimation = false) {
        const level = gameData[levelIndex];
        currentLevel = levelIndex;
        levelCountEl.textContent = level.level;
        guessInput.value = "";
        updateTokenUI();

        const levelCoords = ol.proj.fromLonLat(level.coords);

        // Piyonun (uçağın) konumunu ayarla
        if (!playerPawn.getGeometry()) {
            playerPawn.setGeometry(new ol.geom.Point(levelCoords));
        } else {
            playerPawn.getGeometry().setCoordinates(levelCoords);
        }

        // Uçuş animasyonu bittiyse (skipAnimation = true), kamera animasyonunu atla.
        // Sadece ana menüden başlarken (skipAnimation = false) bu animasyon çalışsın.
        if (!skipAnimation) {
            map.getView().animate({
                center: levelCoords,
                zoom: 6, 
                duration: 2000
            });
        }
    }

    function updateTokenUI() {
        tokenCountEl.textContent = playerTokens;
        btnHintFood.disabled = (playerTokens < 10);
        btnHintColors.disabled = (playerTokens < 10);
    }

    function showPopup(title, contentHTML) {
        // ... (Bu fonksiyon değişmedi) ...
        popupTitle.innerHTML = title;
        popupContent.innerHTML = contentHTML;
        popupOverlay.style.display = 'flex';
        popupOverlay.style.pointerEvents = 'all';
        gsap.to(popupOverlay, { duration: 0.3, opacity: 1 });
    }

    function hidePopup() {
        // ... (Bu fonksiyon değişmedi) ...
        gsap.to(popupOverlay, { duration: 0.3, opacity: 0, onComplete: () => {
            popupOverlay.style.display = 'none';
            popupOverlay.style.pointerEvents = 'none';
        }});
    }

    // === DEĞİŞİKLİK 3: checkGuess Fonksiyonu Tamamen Değişti ===
    function checkGuess() {
        // Animasyon sürerken tekrar tekrar basılmasını engelle
        if (isAnimating) return; 

        const answer = gameData[currentLevel].city.toLowerCase();
        const guess = guessInput.value.trim().toLowerCase();
        
        if (guess === answer) {
            playerTokens += 5;
            showPopup("Doğru!", `<p>Tebrikler! +5 Jeton kazandın.</p>`);
            
            // Oyun bitmediyse, bir sonraki seviyeye uç
            if (currentLevel < gameData.length - 1) {
                isAnimating = true; // Animasyonu başlat
                
                const nextLevelIndex = currentLevel + 1;
                
                // Başlangıç ve Bitiş koordinatlarını al (Harita projeksiyonunda)
                const startCoords = ol.proj.fromLonLat(gameData[currentLevel].coords);
                const endCoords = ol.proj.fromLonLat(gameData[nextLevelIndex].coords);

                // === Uçak Rotasyonu ===
                // Uçağın burnunu hedefe çevirmek için açıyı (radyan) hesapla
                const dx = endCoords[0] - startCoords[0];
                const dy = endCoords[1] - startCoords[1];
                const rotation = Math.atan2(dy, dx);
                // OpenLayers rotasyonu Kuzey'den (yukarı) saat yönünedir.
                // Math.atan2 Doğu'dan (sağ) saat yönünün tersinedir.
                // Bu yüzden (-rotation + Math.PI / 2) formülünü kullanıyoruz.
                const olRotation = -rotation + (Math.PI / 2);
                playerPawn.getStyle().getImage().setRotation(olRotation);

                // === Rota Çizgisi ===
                // Uçağı takip edecek sarı çizgiyi oluştur
                const flightPathLine = new ol.Feature({
                    geometry: new ol.geom.LineString([startCoords, startCoords]) // Çizgi (Başlangıçta 0 uzunlukta)
                });
                flightPathLine.setStyle(new ol.style.Style({
                    stroke: new ol.style.Stroke({
                        color: 'rgba(255, 193, 7, 0.4)',
                        width: 4
                    })
                }));
                gameLayer.getSource().addFeature(flightPathLine);

                // === GSAP Animasyonu ===
                // Geçici bir obje oluşturup, GSAP'in bu objenin x ve y değerlerini
                // başlangıçtan bitişe 2 saniyede götürmesini sağlıyoruz.
                let animProgress = { x: startCoords[0], y: startCoords[1] };
                
                gsap.to(animProgress, {
                    duration: 4.0, // Uçuş süresi (saniye)
                    x: endCoords[0],
                    y: endCoords[1],
                    
                    // onUpdate: Animasyonun HER karesinde çalışan fonksiyon
                    onUpdate: function() {
                        const currentFlightCoords = [animProgress.x, animProgress.y];
                        
                        // 1. UÇAĞIN pozisyonunu güncelle
                        playerPawn.getGeometry().setCoordinates(currentFlightCoords);
                        
                        // 2. ÇİZGİNİN son noktasını güncelle (Çizgi uçağı takip eder)
                        flightPathLine.getGeometry().setCoordinates([startCoords, currentFlightCoords]);
                        
                        // 3. KAMERANIN merkezini güncelle (Kamera uçağı takip eder)
                        map.getView().setCenter(currentFlightCoords);
                    },
                    
                    // onComplete: Animasyon bittiğinde çalışan fonksiyon
                    onComplete: function() {
                        // Hedefe vardık, kamerayı yakınlaştır
                        map.getView().animate({ zoom: 6, duration: 500 });
                        
                        // Pop-up'ı kapat ve sonraki seviyeyi (animasyonsuz) yükle
                        setTimeout(() => {
                            hidePopup();
                            loadLevel(nextLevelIndex, true); // true = kamera animasyonunu atla
                            isAnimating = false; // Animasyon bitti, tekrar tahmin edilebilir
                        }, 500); // Yakınlaşma animasyonundan sonra
                    }
                });

            } else {
                // OYUN BİTTİ
                showPopup("Oyun Bitti!", "<p>Tüm seviyeleri tamamladın!</p>");
                btnGuess.disabled = true;
            }
        } else {
            // YANLIŞ CEVAP
            showPopup("Yanlış!", "<p>Tekrar dene. İpucu kullanmak ister misin?</p>");
        }
    }

    // --- OLAY DİNLEYİCİLERİ ---

    btnStartGame.addEventListener('click', () => {
        // ... (Bu fonksiyon değişmedi) ...
        gsap.to(startMenu, { duration: 0.5, opacity: 0, onComplete: () => {
            startMenu.style.display = 'none';
        }});
        
        gameUI.style.display = 'flex';
        gameUI.style.pointerEvents = 'all';
        gsap.to(gameUI, { duration: 0.5, opacity: 1, delay: 0.5 });
        
        // İlk seviyeyi yükle (Bu, piyonu görünür yapacak ve Paris'e odaklanacak)
        // false (veya boş) gönderdiğimiz için kamera animasyonu çalışacak
        loadLevel(0, false);
    });

    btnGuess.addEventListener('click', checkGuess);
    btnPopupClose.addEventListener('click', hidePopup);

    btnHintFood.addEventListener('click', () => {
        // ... (Bu fonksiyon değişmedi) ...
        if (playerTokens >= 10) {
            playerTokens -= 10;
            updateTokenUI();
            const hintImage = gameData[currentLevel].hint_food;
            showPopup("İpucu: Yöresel Yemek", `<img src="${hintImage}" alt="Yemek İpucu">`);
        }
    });

    btnHintColors.addEventListener('click', () => {
        // ... (Bu fonksiyon değişmedi) ...
        if (playerTokens >= 10) {
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

    // Haritayı ana menü için hemen yükle
    initializeGame();

}; // window.onload sarmalayıcısının sonu