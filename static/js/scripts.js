document.getElementById('todos').onkeypress = function (e) {
    var item = this.value;
    if (e.charCode === 13 && item != '') { Module.addItem() }
}

document.getElementById('done-button').onclick = function (e) { Module.markalldone() }
document.getElementById('pwd').onkeyup = function (e) {if (e.keyCode === 13) login() }
document.getElementById('login').onclick = function (e) { login() }
document.getElementById('logoutmodal').onclick = function (e) { logout() }
document.getElementById('delete_selected').onclick = function (e) { Module.check_for_delete() }

var httpreq = axios.create({
    baseURL: 'http://todo.socialapps.eu/api',
    headers: {
        common: {
            'Authorization': localStorage.accessToken
        }
    }
});

var login = function () {

    if (typeof(Storage) !== "undefined") {
        var email = document.getElementById("email").value;
        var password = document.getElementById("pwd").value;

        var params = new URLSearchParams();
        params.append('email', email);
        params.append('password', password);
        
        httpreq.post('/users/login', params).then(function (response) {
            localStorage.setItem("userid", response.data.userId);
            localStorage.setItem("accessToken", response.data.id);
            $('#loginModal').modal('hide');
            checklogin()
        }).catch(function (error) {
            console.log(error);
        });
    } else {
        console.log('No browser support')
    }

}

var logout = function() {
    localStorage.clear();
    checklogin()
}

var getuserinfo = function() {

    if (localStorage.length > 0) {
        var user = localStorage.userid ? localStorage.userid : null;
        var accessToken = localStorage.accessToken ? localStorage.accessToken : null;
    }

    if (user !== null && accessToken !== null){
    
        httpreq.get('/users/' + user)
        .then(function (response) {
            document.getElementById("user").innerHTML = response.data.name + " " + response.data.lastname;
        })
        .catch(function (error) {
            console.log(error);
        });

    }

}

var checklogin = function(){
    var userid = localStorage.userid;
    var accessToken = localStorage.accessToken;

    if(userid === undefined || accessToken === undefined){
        document.getElementById("loginmodal").style.display = 'block';
        document.getElementById("logoutmodal").style.display = 'none';
        document.getElementById("mainContainer").style.display = 'none';
        document.getElementById("user").innerHTML = null;
    } else {
        getuserinfo()   
        document.getElementById("loginmodal").style.display = 'none';
        document.getElementById("logoutmodal").style.display = 'block';
        document.getElementById("mainContainer").style.display = 'block';
        Module.getItems()     
    }

}

var Module = (function () {

    var userid = localStorage.userid;
    var accessToken = localStorage.accessToken;
    var for_delete = new Array();

    function changestate(e) {

        if (typeof e == 'object') { var id = e.id;
        } else {  var id = e;}

        var params = new URLSearchParams();
        params.append('status', true);

        httpreq.put('/users/' + userid + '/todos/' + id, params)
        .then(function (response) {
            publicMethod();
        })
        .catch(function (error) {
            console.log(error);
        });

    }

    function markalldone() {

        var list = document.getElementById("list").getElementsByTagName("li");

        for (var i = 0; i < list.length; i++) {

            var id = list[i].getElementsByClassName("todo_items")[0].id;
            changestate(id)
        }

    }

    function removeItem(e) {
        var id = e.id;

        httpreq.delete('/users/' + userid + '/todos/' + id)
            .then(function (response) {
                publicMethod();
            })
            .catch(function (error) {
                console.log(error);
            });

    }

    function publicMethod() {

        httpreq.get('/users/' + userid + '/todos')
            .then(function (response) {
                getresult(response.data);
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    var add_to_array = function(value){

        var inarray =  $.inArray(value, for_delete)

        if (inarray === -1){
            for_delete.push(value);    
        } else {
            for_delete.splice(inarray, 1);
        }

    }

    var check_for_delete = function(){

        for (var i = 0; i < for_delete.length; i++) {
            changestate(for_delete[i])
        }
    }

    function getresult(array1) {
        document.getElementById("list").innerHTML = "";
        document.getElementById("deleted").innerHTML = "";

        var ul = document.getElementById("list");
        var deleted = document.getElementById("deleted");
        var items = array1;
        for (i = 0; i < items.length; i++) {
            var li = document.createElement("li");
            var cb = document.createElement('input');
            var span = document.createElement('span');

            if (items[i].status === true) {
                var del_item = document.createElement("li");
                var del_btn = document.createElement('button');
                var del_span = document.createElement('span');
                var del_btn_span = document.createElement('span');
                del_span.innerHTML = items[i].title;
                del_btn.type = 'button';
                del_btn.id = items[i].id;
                del_btn.className = 'btn btn-default float_right';
                del_btn.onclick = function () { return removeItem(this) };
                del_item.className = 'mylist_deleted';
                del_btn_span.className = 'glyphicon glyphicon-trash';


                del_item.appendChild(del_span);
                del_item.appendChild(del_btn);
                del_btn.appendChild(del_btn_span);
                deleted.appendChild(del_item);
            } else {
                cb.type = 'checkbox';
                cb.id = items[i].id;
                cb.checked = items[i].status;
                cb.className = 'todo_items'
                cb.onchange = function () { add_to_array(this.id) };
                li.className = 'mylist';
                span.innerHTML = items[i].title;
                span.id = items[i].id;
                span.className = "mylist_span";
                span.onclick = function () { changestate(this)};

                li.appendChild(cb);
                li.appendChild(span);
                ul.appendChild(li);
            }

        }
        updateItemsLeft(array1)
    }

    function addItemMethod() {
        var item_new = document.getElementById('todos').value;

        if (item_new != '') {
            var params = new URLSearchParams();
            params.append('title', item_new);
            params.append('status', false);

            httpreq.post('/users/' + userid + '/todos/', params)
                .then(function (response) {
                    publicMethod();
                    document.getElementById('todos').value = null;
                })
                .catch(function (error) {
                    console.log(error);
                });

        }
    }

    function updateItemsLeft(array1) {

        var cnt = 0;
        for (var i = 0; i < array1.length; ++i) {
            if (!array1[i].status) {
                cnt++;
            }
        }
        document.getElementById('items-left').innerHTML = cnt;

    }

    return {
        getItems: publicMethod,
        addItem: addItemMethod,
        updateItemsLeft: updateItemsLeft,
        markalldone: markalldone,
        check_for_delete: check_for_delete
    }
})();

checklogin()