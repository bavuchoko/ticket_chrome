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
        <div style="margin-bottom:8px;">
        <button id="fetch-schedules" style="color:blue; text-decoration:underline;">🕊️ _조회하러가기_ </button>
        <div id="schedule-results" style="position:fixed; top:45px; display: none; border: 1px solid black; background: #e9edf3; left: calc(50% - 148px); width: 600px; min-height: 80px;  max-height:900px; overflow-y:auto; margin-top:5px; margin-bottom:5px;"></div>
        </div>
        <label style="width:100px; display:inline-block;">Product ID: 
        <input type="text" id="ticketlink-productId" value="" style="width:120px; margin-bottom:10px; display:inline-block;" />
        </label><br/>
        <label style="width:100px; display:inline-block;">Schedule ID: 
        <input type="text" id="ticketlink-scheduleId" value="" style="width:120px; margin-bottom:10px; display:inline-block;" />
        </label><br/>
        
        <p style="margin-bottom: 10px;">입력 없으면 11시 00 분 </p>
        시간: <input type="text" id="match_hour" value="11" style="width:60px; text-indent: 3px; margin-bottom:10px;" />
        분: <input type="text" id="match_min" value="00" style="width:60px; text-indent: 3px; margin-bottom:10px;" />
        <P style="margin-bottom: 10px;"></P>
        <button id="ticketlink-start" style="margin-right:10px;">시작</button>
        <button onclick="document.getElementById('ticketlink-form').remove(); document.body.style.overflow = '';">취소</button>
        <div id="time-left" style="margin-top: 20px; "></div>
    </div>
  `;
    document.body.appendChild(form);

    document.getElementById('ticketlink-start').onclick = function() {
        const productId = document.getElementById('ticketlink-productId').value.trim();
        const scheduleId = document.getElementById('ticketlink-scheduleId').value.trim();
        const matchHour = document.getElementById('match_hour').value.trim();
        const matchMin = document.getElementById('match_min').value.trim();
        if (!productId || !scheduleId) {
            alert('둘 다 입력하세요!');
            return;
        }


        const targetHour = matchHour ?? 11;
        const targetMinute = matchMin ?? 0;
        const targetSecond = 0;
        const targetMillis = 0;
        const now = new Date();
        const target = new Date(now.getFullYear(), now.getMonth(), now.getDate(), targetHour, targetMinute, targetSecond, targetMillis);

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

    document.getElementById('fetch-schedules').onclick = function() {
        const resultsDiv = document.getElementById('schedule-results');
        resultsDiv.style.display = 'block';
        document.body.style.overflow = 'hidden';
        resultsDiv.innerHTML = '⏳ 불러오는 중...';

        fetch(`https://mapi.ticketlink.co.kr/mapi/sports/schedules?categoryId=137&teamId=63`)
            .then(response => response.json())
            .then(res => {

                const schedules = res.data.schedules || [];
                if (schedules.length === 0) {
                    resultsDiv.innerHTML = '일정 없음';
                    return;
                }
                resultsDiv.innerHTML = '';
                const ul = document.createElement('ul');
                ul.style.width = '100%';

                schedules.forEach(item => {
                    const daysOfWeek = ["일", "월", "화", "수", "목", "금", "토"];
                    const date = new Date(item.scheduleDate);
                    const matchDate = `${(date.getMonth()+1).toString().padStart(2,'0')}.${date.getDate().toString().padStart(2,'0')}`;
                    const matchHour = `${date.getHours().toString().padStart(2,'0')}:${date.getMinutes().toString().padStart(2,'0')}`;
                    const dayOfWeek = daysOfWeek[date.getDay()];
                    const today = new Date();
                    const todayDate = `${(today.getMonth() + 1).toString().padStart(2, '0')}.${today.getDate().toString().padStart(2, '0')}`;
                    const reserve = new Date(item.reserveOpenDate);
                    const reserveDate = `${(reserve.getMonth() + 1).toString().padStart(2, '0')}.${reserve.getDate().toString().padStart(2, '0')}`;

                    if (todayDate !== reserveDate) {
                        return;
                    };

                    const li = document.createElement('li');
                    li.style.cursor = 'pointer';
                    li.style.margin = '15px';
                    li.style.padding = '2px 0';


                    li.onmouseenter = () => {
                        li.style.backgroundColor = '#d0e3ff';
                    };
                    li.onmouseleave = () => {
                        li.style.backgroundColor = '';
                    };

                    li.innerHTML = `
            <div style="display: flex">
                <div class="game-date" style="margin: 0 10px;">
                    <div style="font-size: 16px; display: inline-block; margin-top: 10px;">${matchDate} ${dayOfWeek} ${matchHour}</div>
                </div>
                <div class="team-logo-box">
                    <img class="team-logo" style="width: 40px; height: 40px;" src="${item.homeTeam.logoImagePath}" alt="홈팀">
                    <span class="versus" style="display: inline-block; margin: 10px;">VS</span>
                    <img class="team-logo" style="width: 40px; height: 40px;" src="${item.awayTeam.logoImagePath}" alt="상대팀">
                </div>
                
                <div class="place" style="margin: 10px;">${item.venueName}</div>
                
                <div class="match_info_bx">
                    <p style="text-align: left">s : ${item.scheduleId} </p>
                    <p style="text-align: left">p : ${item.productId} </p>
                </div>
            </div>`;
                    li.onclick = () => {
                        document.getElementById('ticketlink-productId').value = item.productId;
                        document.getElementById('ticketlink-scheduleId').value = item.scheduleId;
                    };
                    ul.appendChild(li);
                });
                resultsDiv.appendChild(ul);
            })
            .catch(err => {
                resultsDiv.innerHTML = '❌ 에러 발생';
                alert(err);
            });
    };
})();
