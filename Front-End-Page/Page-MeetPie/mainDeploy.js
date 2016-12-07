$(document).ready(function() {

    $('#submitBtn').click(function(e) {
        console.log('clicked submit');
        e.preventDefault();

        var jsonData;

        var locationArray = [];

        if ($('#north').prop('checked') == true) {
            locationArray.push('北');
        }
        if ($('#medium').prop('checked') == true) {
            locationArray.push('中');
        }
        if ($('#south').prop('checked') == true) {
            locationArray.push('南');
        }
        if ($('#other').prop('checked') == true) {
            locationArray.push('其他');
        }

        var nameArray = ['前端', '後端', '影像處理', 'Conf', '校園&社團', '軟體', '程式語言', 'app', '工作', '遊戲', '數據分析&AI', '資安', '開發', '作業系統', '硬體', '社群', '網路'];
        var typeArray = [];

        for (var i = 1; i <= 17; i++) {
            var idString = '#type' + i;
            if ($(idString).prop('checked') == true) {
                typeArray.push(nameArray[i - 1]);
            }
        }

        console.log('type Array is ' + typeArray);

        jsonData = {
            url: 'http://140.116.250.18:80',
            type: 'POST',
            dataType: 'json',
            data: {
                keyword: $('#eventKeyword').val(),
                host: $('#hostKeyword').val(),
                location: locationArray,
                type: typeArray,
                date: {
                    start: $('#minTime').val(),
                    end: $('#maxTime').val()
                },
                fee: {
                    lower: $('#minFee').val(),
                    upper: $('#maxFee').val()
                },
                number_of_people: {
                    lower: $('#minPeople').val(),
                    upper: $('#maxPeople').val()
                }
            }
        };

        $.ajax(jsonData)
            .done(function(data) {
                console.log("success");
                console.log(data);
                clean();
                for (var i = 0; i < data.length; i++) {
                    showObject(data[i]);
                }
            })
            .fail(function(data) {
                console.log("error");
            })
            .always(function(data) {
                console.log("always end.");
                console.log(jsonData);
            });
    });

});

function clean() {
    $('div.resultDiv').remove();
}

var resultBlock = '';

function showObject(inputData) {
    console.log('show 1 time');

    var typeList = '';


    for (var i = 0; i < inputData.type.length; i++) {
        typeList = typeList + inputData.type[i] + ' ';
    }

    resultBlock =
        '<div class="resultDiv">' +
        '<div class="eventIntroBox">' +
        '<p class="title">' + inputData.title + '</p>' +
        '<p class="location">活動地點：' + inputData.location + '</p>' +
        '<p class="date">活動日期：' + inputData.start_date + ' ~ ' + inputData.end_date + '</p>' +
        '<p class="type">活動類型：' + typeList + '</p>' +
        '<p class="description">' + inputData.description + '</p>' +
        '<a class="url" target="_blank" href="' + inputData.url + '">立刻報名</a>' +
        '<p class="host">活動主辦單位：' + inputData.host + '</p>' +
        '<p class="fee">活動費用：' + inputData.fee + '</p>' +
        '<p class="number_of_people">活動人數：' + inputData.number_of_people + '</p>' +
        '<p class="source">活動來源：' + inputData.source + '</p>' +
        '</div>';
    if (inputData.image_url !== 'https://t.kfs.io/assets/kktix-og-icon-06989f684356f4d1ff2fc4ab0efd7498.png') {
        resultBlock += '<img class="image_url" src="' + inputData.image_url + '">';
    }
    resultBlock += '</div>';

    $('div#eventBackground').after(resultBlock);
}
