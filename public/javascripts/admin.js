var mapContainer = document.getElementById('map'), // 지도를 표시할 div
    mapOption = {
        center: new kakao.maps.LatLng(33.450701, 126.570667), // 지도의 중심좌표
        level: 3 // 지도의 확대 레벨
    };

var map = new kakao.maps.Map(mapContainer, mapOption); // 지도를 생성합니다


// 지도에 클릭 이벤트를 등록합니다
// 지도를 클릭하면 마지막 파라미터로 넘어온 함수를 호출합니다
kakao.maps.event.addListener(map, 'click', function (mouseEvent) {

    // 클릭한 위도, 경도 정보를 가져옵니다
    var latlng = mouseEvent.latLng;
    const xposition = latlng.getLat();
    const yposition = latlng.getLng();



    $('#coord_x').val(xposition);
    $('#coord_y').val(yposition);

   
});

// $("#").click(function(){
//     $.ajax({
//         type : "POST", 
//         url : "/admin", 
//         data : {name : }, 
//         dataType : "json", 

//     })
// })



