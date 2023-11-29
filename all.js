const ticketCardArea=document.querySelector(".ticketCard-area");
const regionSearch=document.querySelector(".regionSearch");
const searchResultText=document.querySelector("#searchResult-text");
const addTicketBtn=document.querySelector(".addTicket-btn");

const ticketName=document.querySelector("#ticketName");
const ticketImgUrl=document.querySelector("#ticketImgUrl");
const ticketRegion=document.querySelector("#ticketRegion");
const ticketPrice=document.querySelector("#ticketPrice");
const ticketNum=document.querySelector("#ticketNum");
const ticketRate=document.querySelector("#ticketRate");
const ticketDescription=document.querySelector("#ticketDescription");

const ticketNameMessage=document.querySelector("#ticketName-message");
const ticketImgUrlMessage=document.querySelector("#ticketImgUrl-message");
const ticketRegionMessage=document.querySelector("#ticketRegion-message");
const ticketPriceMessage=document.querySelector("#ticketPrice-message");
const ticketNumMessage=document.querySelector("#ticketNum-message");
const ticketRateMessage=document.querySelector("#ticketRate-message");
const ticketDescriptionMessage=document.querySelector("#ticketDescription-message");

const url="https://raw.githubusercontent.com/hexschool/js-training/main/travelApi.json";
let data = [];

//修正，新增完套票後表單輸入框應清除
const addTicketForm=document.querySelector(".addTicket-form");

//修正，新增查無關鍵字區呈現
const cantFindArea=document.querySelector(".cantFind-area");

const regionSearchSelectReset=`<option value="地區搜尋" disabled selected hidden>地區搜尋</option>
<option value="全部地區">全部地區</option>
<option value="台北">台北</option>
<option value="台中">台中</option>
<option value="台南">台南</option>
<option value="高雄">高雄</option>`;

//初始化函式
function init(){
    //取得資料
    axios.get(url)
    .then(function(res){
        data=res.data.data;
        //將渲染函式包在then裡面、賦予data之後，確保取得data後才會執行渲染
        render(data);

        //week7新增圖表
         chartFunc(data);
    })
    .catch(function(err){
        console.log(err);
    })
    regionSearch.innerHTML=regionSearchSelectReset;
}

init();

//搜尋監聽事件
regionSearch.addEventListener("change",function(e){
    
    let filterData=[];

    //修正，將渲染函式片段提出重複利用
    //若為全部地區，則渲染資料集為全部資料，否則為所選地區的資料集
    if(e.target.value=="全部地區"){
        render(data);
    }else{
        data.forEach(function(item){
            if(item.area==e.target.value){
                filterData.push(item);
            }
        })
        render(filterData);
    }
})

const warnStr=`<i class="fas fa-exclamation-circle"></i><span>必填!</span>`;
const rateWarnStr=`<i class="fas fa-exclamation-circle"></i><span>星級區間為1-10!</span>`;


//修正，渲染函式
function render(renderData){
    let str="";
    const len=renderData.length;
    renderData.forEach(function(item){
        str+=`<li class="ticketCard">
                    <div class="ticketCard-img">
                    <a href="#">
                        <img src="${item.imgUrl}" alt="${item.name}">
                    </a>
                    <div class="ticketCard-region">${item.area}</div>
                    <div class="ticketCard-rank">${item.rate}</div>
                    </div>
                    <div class="ticketCard-content">
                    <div>
                        <h3>
                        <a href="#" class="ticketCard-name">${item.name}</a>
                        </h3>
                        <p class="ticketCard-description">
                        ${item.description}
                        </p>
                    </div>
                    <div class="ticketCard-info">
                        <p class="ticketCard-num">
                        <span><i class="fas fa-exclamation-circle"></i></span>
                        剩下最後 <span id="ticketCard-num"> ${item.group} </span> 組
                        </p>
                        <p class="ticketCard-price">
                        TWD <span id="ticketCard-price">$${item.price}</span>
                        </p>
                    </div>
                    </div>
                </li>`       
    })
    ticketCardArea.innerHTML=str;
    searchResultText.textContent=`本次搜尋共 ${len} 筆資料`;

    //修正，無搜尋資料時的呈現
    if(len==0){
        cantFindArea.classList.add("d-block");
    }else{
        cantFindArea.setAttribute("class","cantFind-area")
    }
}

//新增套票按鈕監聽事件
addTicketBtn.addEventListener("click",function(){
    let contentComplete=true;

    //每個欄位確保確實填寫
    if(!ticketName.value){
        ticketNameMessage.innerHTML=warnStr;
        contentComplete=contentComplete && false;
    }else{
        ticketNameMessage.innerHTML="";
        contentComplete=contentComplete && true;
        contentComplete=contentComplete && true;
    }

    if(!ticketImgUrl.value){
        ticketImgUrlMessage.innerHTML=warnStr;
        contentComplete=contentComplete && false;
    }else{
        ticketImgUrlMessage.innerHTML="";
        contentComplete=contentComplete && true;
    }

    if(!ticketRegion.value){
        ticketRegionMessage.innerHTML=warnStr;
        contentComplete=contentComplete && false;
    }else{
        ticketRegionMessage.innerHTML="";
        contentComplete=contentComplete && true;
    }

    if(ticketPrice.value==0 || !ticketPrice.value){
        ticketPriceMessage.innerHTML=warnStr;
        contentComplete=contentComplete && false;
    }else{
        ticketPriceMessage.innerHTML="";
        contentComplete=contentComplete && true;
    }

    if(ticketNum.value==0 || !ticketNum.value){
        ticketNumMessage.innerHTML=warnStr;
        contentComplete=contentComplete && false;
    }else{
        ticketNumMessage.innerHTML="";
        contentComplete=contentComplete && true;
    }

    if(ticketRate.value==0 || !ticketRate.value){
        ticketRateMessage.innerHTML=warnStr;
        contentComplete=contentComplete && false;
    }else if(ticketRate.value>10 || ticketRate.value<1){
        ticketRateMessage.innerHTML=rateWarnStr;
        contentComplete=contentComplete && false;
    }else{
        ticketRateMessage.innerHTML="";
        contentComplete=contentComplete && true;
    }

    if(!ticketDescription.value){
        ticketDescriptionMessage.innerHTML=warnStr;
        contentComplete=contentComplete && false;
    }else{
        ticketDescriptionMessage.innerHTML="";
        contentComplete=contentComplete && true;
    }

    //若內容皆正確填寫，將資料寫入data，並初始畫面
    if(contentComplete){

        //修正，需賦予id值，此為隨機碼
        let myuuid = crypto.randomUUID();
   
        data.push({
            "name":ticketName.value,
            "imgUrl":ticketImgUrl.value,
            "area":ticketRegion.value,
            "description":ticketDescription.value,
            //修正，<input>取得的值型別為字串，需轉為數值
            "group":Number(ticketNum.value),
            "price":Number(ticketPrice.value),
            "rate":Number(ticketRate.value),
            //修正，需賦予id值，此為隨機碼
            "id":myuuid
        })
        // 修正，新增完套票後表單輸入框應清除
        addTicketForm.reset();
        //修正，新增套票後搜尋下拉選單應恢復為初始狀態
        regionSearch.innerHTML=regionSearchSelectReset;
        render(data);
        //week7新增圖表
        chartFunc(data);
    }
})


// week7 新增圖表
// week7 新增圖表

function chartFunc(chartData){
    let areaSumObj={}; //數值統計結果
    let chartRenderData=[]; //可以做渲染圖表的格式

    chartData.forEach(function(item){
        if(areaSumObj[item.area]==undefined){
            areaSumObj[item.area]=1;
        }else{
            areaSumObj[item.area]+=1;
        }
    })

    const areaArr=Object.keys(areaSumObj); //放原始資料統計結果 物件的keys
    areaArr.forEach(function(area){ //遍歷這些keys，將key與對應value做成arr，丟到最終要渲染的陣列內
        let arr=[];
        arr.push(area);
        arr.push(areaSumObj[area]);
        chartRenderData.push(arr);
    })

    const chart = c3.generate({
        bindto: '#chart',
        data: {
            columns:chartRenderData,
            type : 'donut',
            onclick: function (d, i) { console.log("onclick", d, i); },
            onmouseover: function (d, i) { console.log("onmouseover", d, i); },
            onmouseout: function (d, i) { console.log("onmouseout", d, i); }
        },
        donut: {
            title: "套票地區比重",
            width: 16,
            label: {
                show: false
              }
        },
        color: {
            pattern: ['#E68619', '#26BFC7', '#5151D3', '#ffbb78', '#2ca02c', '#98df8a', '#d62728', '#ff9896', '#9467bd', '#c5b0d5', '#8c564b', '#c49c94', '#e377c2', '#f7b6d2', '#7f7f7f', '#c7c7c7', '#bcbd22', '#dbdb8d', '#17becf', '#9edae5']
        }
    });
}
