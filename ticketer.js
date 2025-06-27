(function(){

    const oldForm = document.getElementById('ticketlink-form');
    if (oldForm) oldForm.remove();

    const updateBg = (seconds) => {
        const main = document.getElementById('main-container');
        const color =['#ee2412', '#ee3a12', '#ee4d12','#ee5f12', '#ee7512', '#ee8712','#eea112', '#eec212', '#eedc12'];
        if (seconds < 8 && seconds >= 0) {
            main.style.background = color[seconds];
        };
    };



    const form = document.createElement('div');
    form.id = 'ticketlink-form';
    form.style.position = 'fixed';
    form.style.top = '50px';
    form.style.left = 'calc(50% - 426px)';
    form.style.background = 'white';
    form.style.border = '1px solid black';
    form.style.zIndex = 99999;
    form.innerHTML = `
    <div id="main-container" style="font-size:14px; width:250px; background: #e9edf3; padding:10px;">
    <style>
    .toggle-container {
            display: flex;
            align-items: center;
            height: 30px; /* 원하는 높이 */
        }

        .toggle-switch {
            width: 35px;
            height: 20px;
            background-color: #ccc;
            border-radius: 50px;
            position: relative;
            display: inline-block;
            cursor: pointer;
            transition: background-color 0.1s;
        }

        .toggle-switch::after {
            content: "";
            width: 16px;
            height: 16px;
            background-color: white;
            border-radius: 50%;
            position: absolute;
            top: 2px;
            left: 2px;
            transition: transform 0.1s;
        }

        input[type="checkbox"]:checked + .toggle-switch {
            background-color: #2f2f2f;
        }

        input[type="checkbox"]:checked + .toggle-switch::after {
            transform: translateX(15px);
        }
        .today-game {
        position: relative;
        border: 2px solid red;
        }
        
    .today-game::before {
        content: "오늘오픈";
        position: absolute;
        top: -10px;
        left: -10px;
        background-color: red;
        color: white;
        font-size: 11px;
        font-weight: bold;
        padding: 2px 6px;
        border-top-left-radius: 4px;
        border-top-right-radius: 4px;
        transform: rotate(-8deg);
    }
        </style>
       <input id="ticketlink-reserveOpenDate" style="display: none">
        <div style="margin-bottom:8px;">
            <button id="fetch-schedules" style="color:blue; text-decoration:underline;">🕊️ _조회하기 -> </button>
            <div id="schedule-results" style="position:fixed; top:45px; display: none; border: 1px solid black; background: #e9edf3; left: calc(50% - 148px); width: 670px; min-height: 120px;  max-height:700px; overflow-y:hidden; margin-top:5px; margin-bottom:5px;">
           
               <div style="display: flex; align-items: center; gap: 10px; padding: 10px 5px;">
                    <button style="">팀선택</button>
                    | 
                    <button style="margin-left: auto">홈경기만 보기</button>
             
                    <div class="toggle-container" style="">
                        <input type="checkbox" id="home" hidden checked />
                        <label for="home" class="toggle-switch"></label>
                    </div>
                    | 
                    <button style="margin-left: auto">오늘예매 하는 경기만 보기</button>
             
                    <div class="toggle-container" style="">
                        <input type="checkbox" id="today" hidden checked />
                        <label for="today" class="toggle-switch"></label>
                    </div>
                </div>
                
                
                <div style="width: calc(100% - 5px); padding-left: 5px; background: aqua; height:40px; display: flex; align-items: center; gap: 15px;  ">
                    <button class="">
                        <img style="width: 40px; height: 40px; scale: 1.3"  src="http://image.toast.com/aaaaab/ticketlink/TKL_6/Hanwha(new)(1).png" data-id="63" data-name="한화">
                    </button>
                    <button>
                        <img style="width: 40px; height: 40px; scale: 0.8"  src="http://image.toast.com/aaaaab/ticketlink/TKL_2/Baseball_samsung.png" data-id="57" data-name="삼성">
                    </button>
                    <button>
                        <img style="width: 40px; height: 40px; scale: 0.8" src="http://image.toast.com/aaaaab/ticketlink/TKL_8/Baseball_kia(1).png" data-id="58" data-name="KIA">
                    </button><button>
                        <img style="width: 40px; height: 40px; scale: 0.8" src="http://image.toast.com/aaaaab/ticketlink/TKL_9/Baseball_kt.png" data-id="62" data-name="KT">
                    </button>
                    <button>
                        <img style="width: 40px; height: 40px; scale: 0.8" src="http://image.toast.com/aaaaab/ticketlink/TKL_1/Baseball_LG.png" data-id="59" data-name="LG">
                    </button>
                    <button>
                        <img style="width: 40px; height: 40px; scale: 0.8" src="http://image.toast.com/aaaaab/ticketlink/TKL_3/Baseball_SSG.png" data-id="476" data-name="SSG">
                    </button>
                    
                </div>
                
                
                <div id="schedule-list" style="width: 100%; min-height: 80px;  max-height:660px; overflow-y: auto"></div>
            </div>
        </div>
        <label style="width:100px; display:inline-block;">Product ID: 
        <input type="text" id="ticketlink-productId" value="" style="width:120px; margin-bottom:10px; display:inline-block;" />
        </label><br/>
        <label style="width:100px; display:inline-block;">Schedule ID: 
        <input type="text" id="ticketlink-scheduleId" value="" style="width:120px; margin-bottom:10px; display:inline-block;" />
        </label><br/>
        
        <P style="margin-bottom: 10px;"></P>
        <button id="ticketlink-start" style="margin-right:10px;">시작</button>
        <button onclick="document.getElementById('ticketlink-form').remove(); document.body.style.overflow = '';">닫기</button>
        <div id="time-left" style="margin-top: 20px; "></div>
    </div>
  `;
    document.body.appendChild(form);

    document.getElementById('ticketlink-start').onclick = function() {
        const productId = document.getElementById('ticketlink-productId').value.trim();
        const scheduleId = document.getElementById('ticketlink-scheduleId').value.trim();
        const reserveOpenDate = Number(document.getElementById('ticketlink-reserveOpenDate').value.trim());
        if (!productId || !scheduleId) {
            alert('둘 다 입력하세요!');
            return;
        }


        const target = new Date(reserveOpenDate);
        const checkTime = setInterval(() => {
            const now = new Date();
            if (target - now <= 50) {
                document.getElementById('ticketlink-form').remove();
                clearInterval(checkTime);
                const url = `https://www.ticketlink.co.kr/reserve/product/${productId}?scheduleId=${scheduleId}`;
                window.open(url);
            }else{
                const timeLeftDiv = document.getElementById("time-left");

                const totalSeconds = Math.floor((target - now) / 1000);
                const milliseconds = String((target - now) % 1000).padStart(3, '0');

                const min = Math.floor(totalSeconds / 60);
                const seconds = totalSeconds % 60;

                let timeString = '';

                if (min > 0) {
                    timeString += `${min}분 `;
                }

                timeString += `${seconds}초 ${milliseconds}ms`;
                updateBg(totalSeconds);
                timeLeftDiv.innerHTML = `
                  <p style="margin: 0"> -남은 시간- </p>
                  <p style="margin: 0">${timeString}</p>
                `;
            }
        }, 10);
    };

    document.getElementById('today').addEventListener('change', () => {
        const selectedImg = document.querySelector('#schedule-results button img[style*="scale: 1.3"]');
        const teamId = selectedImg ? selectedImg.dataset.id : '63';
        fetchSchedulesByTeam(teamId);
    });


    document.getElementById('home').addEventListener('change', () => {
        const selectedImg = document.querySelector('#schedule-results button img[style*="scale: 1.3"]');
        const teamId = selectedImg ? selectedImg.dataset.id : '63';
        fetchSchedulesByTeam(teamId);
    });

    document.querySelectorAll('#schedule-results button img').forEach(img => {
        img.parentElement.onclick = function () {
            const teamId = this.querySelector('img').dataset.id;

            document.querySelectorAll('#schedule-results button img').forEach(otherImg => {
                otherImg.style.scale = '0.8';
            });

            this.querySelector('img').style.scale = '1.3';

            fetchSchedulesByTeam(teamId);
        };
    });


    function createScheduleListItem(item, isTodayGame) {
        const daysOfWeek = ["일", "월", "화", "수", "목", "금", "토"];
        const date = new Date(item.scheduleDate);
        const matchDate = `${(date.getMonth() + 1).toString().padStart(2, '0')}.${date.getDate().toString().padStart(2, '0')}`;
        const matchHour = `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
        const dayOfWeek = daysOfWeek[date.getDay()];

        const reserveTime = new Date(item.reserveOpenDateTime);
        const rDate = `${(reserveTime.getMonth()+1).toString().padStart(2,'0')}.${reserveTime.getDate().toString().padStart(2,'0')} (${daysOfWeek[reserveTime.getDay()]})`;
        const openHour = reserveTime.getHours().toString().padStart(2, '0');
        const openMin = reserveTime.getMinutes().toString().padStart(2, '0');
        
        const li = document.createElement('li');
        li.style.cursor = 'pointer';
        li.style.margin = '10px';
        li.style.padding = '2px 0';
        if (isTodayGame) {
            li.classList.add('today-game');
        }
        li.onmouseenter = () => li.style.backgroundColor = '#d0e3ff';
        li.onmouseleave = () => li.style.backgroundColor = '';

        li.innerHTML = `
        <div style="display: flex">
            <div class="game-date" style=" width: 120px; line-height: 40px;">
                <div style="font-size: 16px; display: inline-block;">${matchDate} ${dayOfWeek} ${matchHour}</div>
            </div>
            <div class="team-logo-box" style=" width: 125px;">
                <img class="team-logo" style="width: 40px; height: 40px;" src="${item.homeTeam.logoImagePath}" alt="홈팀">
                <span class="versus" style="display: inline-block; margin: 10px;">VS</span>
                <img class="team-logo" style="width: 40px; height: 40px;" src="${item.awayTeam.logoImagePath}" alt="상대팀">
            </div>
            <div class="place" style=" width: 165px; line-height: 40px;">${item.venueName}</div>
            <div class="match_info_bx" style="  width: 120px;">
                <p style="text-align: left">s : ${item.scheduleId} </p>
                <p style="text-align: left">p : ${item.productId} </p>
            </div>
            <div class="match-btn" style="width: 120px; line-height: 40px;">
                <p style="margin: 0">${rDate} ${openHour}:${openMin}</p>
            </div>
        </div>
    `;

        li.onclick = () => {
            document.getElementById('ticketlink-productId').value = item.productId;
            document.getElementById('ticketlink-scheduleId').value = item.scheduleId;
            document.getElementById('ticketlink-reserveOpenDate').value = item.reserveOpenDate;
        };

        return li;
    }

    function fetchData(teamId, innerDiv) {
        fetch(`https://mapi.ticketlink.co.kr/mapi/sports/schedules?categoryId=137&teamId=${teamId}`)
            .then(response => response.json())
            .then(res => {
                const schedules = res.data.schedules || [];
                innerDiv.innerHTML = '';
                const ul = document.createElement('ul');
                ul.style.width = '100%';
                let found = 0;

                const filterTodayOnly = document.getElementById('today').checked;
                const filterHomeOnly = document.getElementById('home')?.checked ?? false;

                schedules.forEach(item => {
                    const today = new Date();
                    const todayDate = `${(today.getMonth() + 1).toString().padStart(2, '0')}.${today.getDate().toString().padStart(2, '0')}`;
                    const reserve = new Date(item.reserveOpenDate);
                    const reserveDate = `${(reserve.getMonth() + 1).toString().padStart(2, '0')}.${reserve.getDate().toString().padStart(2, '0')}`;
                    const isTodayGame = todayDate == reserveDate;
                    if (filterTodayOnly && !isTodayGame) return;
                    if (filterHomeOnly && String(item.homeTeam.teamId) !== String(teamId)) return;

                    found++;
                    const li = createScheduleListItem(item, isTodayGame);
                    ul.appendChild(li);
                });

                if (found === 0) {
                    innerDiv.innerHTML = '<p style="text-align: center; margin-top: 23px;">📭 오늘 예매하는 경기가 없습니다.</p>';
                } else {
                    innerDiv.appendChild(ul);
                }
            })
            .catch(err => {
                innerDiv.innerHTML = '❌ 에러 발생';
                alert(err);
            });
    }


    document.getElementById('fetch-schedules').onclick = function() {
        const resultsDiv = document.getElementById('schedule-results');
        const innerDiv = document.getElementById('schedule-list');
        resultsDiv.style.display = 'block';
        document.body.style.overflow = 'hidden';
        innerDiv.innerHTML = '⏳ 불러오는 중...';

        fetchData(63, innerDiv);
    };

    function fetchSchedulesByTeam(teamId) {
        const resultsDiv = document.getElementById('schedule-results');
        const innerDiv = document.getElementById('schedule-list');
        resultsDiv.style.display = 'block';
        document.body.style.overflow = 'hidden';
        innerDiv.innerHTML = '⏳ 불러오는 중...';

        fetchData(teamId, innerDiv);
    }
})();
