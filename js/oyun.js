// 'window.onload' sarmalayıcısı, tüm kütüphanelerin yüklenmesini bekler.
window.onload = function() {

    // === GÜNCELLENMİŞ OYUN VERİTABANI ===
    // 1. 'hint_food_name' (Yemek Adı) eklendi
    const gameData = [
        // 1. Paris
        { 
            city: "Paris", 
            city_tr: "Paris",
            country: "France",
            coords: [2.3522, 48.8566], 
            hint_food: "images/ipucu-paris.png", 
            hint_food_name: "Croissant", // YENİ
            hint_colors: ['#0055A4', '#FFFFFF', '#EF4135'],
            flag_img: "images/flag-fransa.png",
            info_history: "Known as the 'City of Light'. Home to the Eiffel Tower.",
            info_cuisine: "Famous for croissants, baguettes, macarons, and wine."
        },
        // 2. Tokyo
        { 
            city: "Tokyo", 
            city_tr: "Tokyo",
            country: "Japan",
            coords: [139.6917, 35.6895], 
            hint_food: "images/ipucu-tokyo.png", 
            hint_food_name: "Sushi", // YENİ
            hint_colors: ['#FFFFFF', '#BC002D'],
            flag_img: "images/flag-japonya.png",
            info_history: "Formerly named 'Edo'. A mix of modern skyscrapers and traditional temples.",
            info_cuisine: "The home of sushi, sashimi, and ramen. Known for fresh seafood."
        },
        // 3. Kahire
        { 
            city: "Cairo", 
            city_tr: "Kahire",
            country: "Egypt",
            coords: [31.2357, 30.0444], 
            hint_food: "images/ipucu-cairo.png", 
            hint_food_name: "Koshari", // YENİ
            hint_colors: ['#CE1126', '#FFFFFF', '#000000'],
            flag_img: "images/flag-misir.png",
            info_history: "'The City of a Thousand Minarets'. Near the Pyramids of Giza.",
            info_cuisine: "Famous for street food like Koshari, Ful Medames, and Ta'ameya."
        },
        // 4. Ankara
        { 
            city: "Ankara", 
            city_tr: "Ankara",
            country: "Türkiye",
            coords: [32.8597, 39.9334], 
            hint_food: "images/ipucu-ankara.png", 
            hint_food_name: "Simit", // YENİ
            hint_colors: ['#E30A17', '#FFFFFF'],
            flag_img: "images/flag-turkiye.png",
            info_history: "The capital of the Republic of Türkiye. Home to Anıtkabir.",
            info_cuisine: "Known for Ankara Tava (roast) and the famous 'simit'."
        },
        // 5. Roma
        { 
            city: "Rome", 
            city_tr: "Roma",
            country: "Italy",
            coords: [12.4964, 41.9028], 
            hint_food: "images/ipucu-rome.png", 
            hint_food_name: "Carbonara", // YENİ
            hint_colors: ['#008C45', '#F4F5F0', '#CD212A'],
            flag_img: "images/flag-italya.png",
            info_history: "The 'Eternal City'. Full of ancient wonders like the Colosseum.",
            info_cuisine: "Home of Carbonara and Cacio e Pepe pasta, pizza, and gelato."
        },
        // 6. Londra
        { 
            city: "London", 
            city_tr: "Londra",
            country: "United Kingdom",
            coords: [-0.1276, 51.5072], 
            hint_food: "images/ipucu-london.png", 
            hint_food_name: "Fish and Chips", // YENİ
            hint_colors: ['#012169', '#FFFFFF', '#C8102E'],
            flag_img: "images/flag-birlesik-krallik.png",
            info_history: "Founded by the Romans. Home to the Tower of London and Buckingham Palace.",
            info_cuisine: "Famous for Fish and Chips, Sunday Roast, and Afternoon Tea."
        },
        // 7. Berlin
        { 
            city: "Berlin", 
            city_tr: "Berlin",
            country: "Germany",
            coords: [13.4050, 52.5200], 
            hint_food: "images/ipucu-berlin.png", 
            hint_food_name: "Currywurst", // YENİ
            hint_colors: ['#000000', '#DD0000', '#FFCC00'],
            flag_img: "images/flag-almanya.png",
            info_history: "Divided by the Berlin Wall during the Cold War. Symbolized by the Brandenburg Gate.",
            info_cuisine: "Famous for street food like Currywurst. Schnitzel is also popular."
        },
        // 8. Madrid
        { 
            city: "Madrid", 
            city_tr: "Madrid",
            country: "Spain",
            coords: [-3.7038, 40.4168], 
            hint_food: "images/ipucu-madrid.png", 
            hint_food_name: "Paella", // YENİ
            hint_colors: ['#AA151B', '#F1B53B'],
            flag_img: "images/flag-ispanya.png",
            info_history: "The heart of Spain. Known for the Royal Palace and Prado Museum.",
            info_cuisine: "Center of 'tapas' culture. Try Jamón Ibérico and Churros with chocolate."
        },
        // 9. Moskova
        { 
            city: "Moscow", 
            city_tr: "Moskova",
            country: "Russia",
            coords: [37.6173, 55.7558], 
            hint_food: "images/ipucu-moscow.png", 
            hint_food_name: "Borscht", // YENİ
            hint_colors: ['#FFFFFF', '#0039A6', '#D52B1E'],
            flag_img: "images/flag-rusya.png",
            info_history: "Famous for the Red Square, the Kremlin, and St. Basil's Cathedral.",
            info_cuisine: "Known for Borscht (beet soup), Pelmeni (dumplings), and Beef Stroganoff."
        },
        // 10. Washington D.C.
        { 
            city: "Washington", 
            city_tr: "Vaşington",
            country: "USA",
            coords: [-77.0369, 38.9072], 
            hint_food: "images/ipucu-washington.png", 
            hint_food_name: "Crab Cakes", // YENİ
            hint_colors: ['#B22234', '#FFFFFF', '#3C3B6E'],
            flag_img: "images/flag-abd.png",
            info_history: "Capital of the USA. Home to the White House and Lincoln Memorial.",
            info_cuisine: "Local specialties include Crab Cakes and the 'Half-Smoke' sausage."
        },
        // 11. Mexico City
        { 
            city: "Mexico City", 
            city_tr: "Meksiko",
            country: "Mexico",
            coords: [-99.1332, 19.4326], 
            hint_food: "images/ipucu-mexico-city.png", 
            hint_food_name: "Tacos al Pastor", // YENİ
            hint_colors: ['#006847', '#FFFFFF', '#CE1126'],
            flag_img: "images/flag-meksika.png",
            info_history: "Built on the ancient Aztec capital, Tenochtitlan. Main square is the Zócalo.",
            info_cuisine: "UNESCO heritage cuisine. Famous for Tacos al Pastor and Quesadillas."
        },
        // 12. Brasilia
        { 
            city: "Brasilia", 
            city_tr: "Brazilya",
            country: "Brazil",
            coords: [-47.8825, -15.7942], 
            hint_food: "images/ipucu-brasilia.png", 
            hint_food_name: "Feijoada", // YENİ
            hint_colors: ['#009B3A', '#FFCC29', '#002776'],
            flag_img: "images/flag-brezilya.png",
            info_history: "A futuristic capital city planned and built in the 1950s by Oscar Niemeyer.",
            info_cuisine: "National dish 'Feijoada', 'Pão de Queijo' (cheese bread), and 'Churrasco' (BBQ)."
        },
        // 13. Buenos Aires
        { 
            city: "Buenos Aires", 
            city_tr: "Buenos Aires",
            country: "Argentina",
            coords: [-58.3816, -34.6037], 
            hint_food: "images/ipucu-buenos-aires.png", 
            hint_food_name: "Asado", // YENİ
            hint_colors: ['#75AADB', '#FFFFFF', '#FFB81C'],
            flag_img: "images/flag-arjantin.png",
            info_history: "'The Paris of South America'. The birthplace of Tango in La Boca.",
            info_cuisine: "World-famous beef and 'Asado' (barbecue). Try 'Empanadas' (pastries)."
        },
        // 14. Pekin
        { 
            city: "Beijing", 
            city_tr: "Pekin",
            country: "China",
            coords: [116.4074, 39.9042], 
            hint_food: "images/ipucu-beijing.png", 
            hint_food_name: "Peking Duck", // YENİ
            hint_colors: ['#EE1C25', '#FFFF00'],
            flag_img: "images/flag-cin.png",
            info_history: "The imperial capital. Home to the Forbidden City and Tiananmen Square.",
            info_cuisine: "Most famous for 'Peking Duck'. 'Jiaozi' (dumplings) are also popular."
        },
        // 15. Canberra
        { 
            city: "Canberra", 
            city_tr: "Kanberra",
            country: "Australia",
            coords: [149.1300, -35.2809], 
            hint_food: "images/ipucu-canberra.png", 
            hint_food_name: "Vegemite", // YENİ
            hint_colors: ['#00008B', '#FFFFFF', '#FF0000'],
            flag_img: "images/flag-avustralya.png",
            info_history: "A planned capital city, built to end the Sydney/Melbourne rivalry.",
            info_cuisine: "Try 'Barramundi' (fish) or 'Vegemite'. Kangaroo meat is also available."
        }
    ];
    // === /VERİTABANI SONU ===

    // Oyunu karıştırma fonksiyonunu çağır
    shuffleGameData(gameData);

    // --- DOM ELEMENTLERİNİ ALMA ---
    // (Değişiklik yok)
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
    
    // --- SES DOSYALARI ---
    // (Değişiklik yok)
    const sfxCorrect = new Audio('audio/correct-answer.mp3');
    const sfxWrong = new Audio('audio/wrong-answer.mp3');
    const sfxPlane = new Audio('audio/plane-fly.mp3');
    const sfxHint = new Audio('audio/ipucu-ses.mp3');

    // --- OYUN DURUMU DEĞİŞKENLERİ ---
    // (Değişiklik yok)
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
    
    // --- BAŞLANGIÇ SES SEVİYELERİ ---
    // (Değişiklik yok)
    sfxCorrect.volume = sliderEffects.value / 100;
    sfxWrong.volume = sliderEffects.value / 100;
    sfxPlane.volume = sliderEffects.value / 100;
    sfxHint.volume = sliderEffects.value / 100;

    // --- HARİTA KURULUMU (Varsayılan Uydu) ---
    // (Değişiklik yok)
    function initializeGame() {
        mainMapLayer = new ol.layer.Tile({ source: satelliteSource });
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
    // (loadLevel, updateTokenUI, hidePopup fonksiyonları değişmedi)
    function loadLevel(levelIndex, skipAnimation = false) {
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
        tokenCountEl.textContent = playerTokens;
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
    }
    function hidePopup() {
        gsap.to(popupOverlay, { duration: 0.3, opacity: 0, onComplete: () => {
            popupOverlay.style.display = 'none';
            popupOverlay.style.pointerEvents = 'none';
        }});
    }

    // (checkGuess fonksiyonu değişmedi)
    function checkGuess() {
        if (isAnimating) return; 

        const levelData = gameData[currentLevel];
        
        const answer_en = levelData.city.toLowerCase();
        const answer_tr = levelData.city_tr.toLowerCase();
        const guess = guessInput.value.trim().toLowerCase();
        
        if (guess === answer_en || guess === answer_tr) {
            sfxCorrect.play(); 
            playerTokens += 5;

            const infoCardHTML = `
                <div class="info-card">
                    <img src="${levelData.flag_img}" class="info-flag" alt="${levelData.country} Flag">
                    <h3>${levelData.city}, ${levelData.country}</h3>
                    <p class="info-tokens">+5 Tokens Earned!</p>
                    <p class="info-text">${levelData.info_history}</p>
                    <p class="info-text">${levelData.info_cuisine}</p>
                </div>
            `;

            showPopup("Correct!", infoCardHTML, "Great, keep going!");
            
            if (currentLevel < gameData.length - 1) {
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
                const flightPathLine = new ol.Feature({
                    geometry: new ol.geom.LineString([startCoords, startCoords])
                });
                flightPathLine.setStyle(new ol.style.Style({
                    stroke: new ol.style.Stroke({ color: 'rgba(255, 193, 7, 0.4)', width: 4 })
                }));
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
                showPopup("Game Over!", "<p>You completed all levels!</p>", "Play Again");
                btnGuess.disabled = true;
            }
        } else {
            sfxWrong.play(); 
            showPopup("Incorrect!", "<p>Try again. Need a hint?</p>");
        }
    }

    // (shuffleGameData, showSettings, hideSettings fonksiyonları değişmedi)
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

    // --- OLAY DİNLEYİCİLERİ ---
    // (btnStartGame, btnGuess, btnPopupClose değişmedi)
    btnStartGame.addEventListener('click', () => {
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

    // === DEĞİŞİKLİK: btnHintFood (Yemek adını gösterecek) ===
    btnHintFood.addEventListener('click', () => {
        if (playerTokens >= 10) {
            sfxHint.play(); 
            sfxHint.currentTime = 0; 
            playerTokens -= 10;
            updateTokenUI();

            // Resim ve isim verilerini al
            const levelData = gameData[currentLevel];
            const hintImage = levelData.hint_food;
            const hintName = levelData.hint_food_name;

            // Pop-up için yeni HTML oluştur
            const hintHTML = `
                <div class="hint-food-popup">
                    <img src="${hintImage}" alt="Food Hint">
                    <p>${hintName}</p>
                </div>
            `;
            
            showPopup("Hint: Local Food", hintHTML);
        }
    });
    // === /DEĞİŞİKLİK ===


    // (btnHintColors fonksiyonu değişmedi)
    btnHintColors.addEventListener('click', () => {
        if (playerTokens >= 10) {
            sfxHint.play(); 
            sfxHint.currentTime = 0; 
            playerTokens -= 10;
            updateTokenUI();
            const hintColors = gameData[currentLevel].hint_colors;
            let colorHTML = '<div class="color-swatches">';
            hintColors.forEach(color => {
                colorHTML += `<div class="color-swatch" style="background-color: ${color};"></div>`;
            });
            colorHTML += '</div>';
            showPopup("Hint: Flag Colors", colorHTML);
        }
    });

    // --- AYARLAR OLAY DİNLEYİCİLERİ ---
    // (Değişiklik yok)
    btnSettings.addEventListener('click', showSettings);
    btnSettingsClose.addEventListener('click', hideSettings);

    sliderBrightness.addEventListener('input', (e) => {
        brightnessOverlay.style.opacity = (1 - e.target.value) * 0.7;
    });

    sliderMusic.addEventListener('input', (e) => {
        console.log("Music Volume:", e.target.value);
    });

    sliderEffects.addEventListener('input', (e) => {
        const effectVolume = e.target.value / 100;
        sfxCorrect.volume = effectVolume;
        sfxWrong.volume = effectVolume;
        sfxPlane.volume = effectVolume;
        sfxHint.volume = effectVolume;
    });

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