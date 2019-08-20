(function () {

    function subscribe(url, callback) {
        var source = new window.EventSource(url);

        source.onmessage = function (e) {
            callback(e.data);
        };

        source.onerror = function (e) {
            if (source.readyState == window.EventSource.CLOSED) return;

            console.log('sse error', e);
        };

        return source.close.bind(source);
    };
    var button = document.querySelector('#button')
    var name_div = document.querySelector('#name')
    var age_div = document.querySelector('#age')
    button.addEventListener('click', function () {
        name_div.innerHTML = '30,不是初始值了'
    })
    function changeAge(data) {
        console.log('in change',data)
        age_div.innerHTML = '服务端更新！！！age为' + data.msg
    }
    window.changeAge = changeAge
    function jsonp(url) {
        var frame = document.createElement('script');
        frame.src = url;
        document.querySelector('body').append(frame);
    }
    subscribe('/eventstream', function (data) {
        if (data && /reload/.test(data)) {
            // window.location.reload();
            console.log('内容更新发送jsop')
            jsonp('/js?callback=changeAge')
        }
    });
    
}());