

class Friend {
    constructor(name, avatar, music) {
        this.name = name; 
        this.avatar = avatar; 
        this.music = music; 
    }
}

class FriendsList {
    static url = 'https://64797baca455e257fa633c34.mockapi.io/api/friends';

    static getAllFriends() {
        return $.get(this.url);
    }

    static getFriend(id) {
        return $.get(this.url + `/${id}`);
    }

    static addFriend(friend) {
        return $.post(this.url, friend); 
    }

    static updateFriend(friend, avatar) {
        const updatedFriend = {
            name: friend.name, 
            avatar: avatar, 
            music: friend.music
        }
        return $.ajax({
            url: this.url + `/${friend.id}`,
            dataType: 'json',
            data: JSON.stringify(updatedFriend),
            contentType: 'application/json',
            type: 'PUT'
        });
    }

    static deleteFriend(id) {
        return $.ajax({
            url: this.url + `/${id}`,
            type: 'DELETE'
        });
    }
}


class DOMManager {
    static friends; 

    static getAllFriends() {
        FriendsList.getAllFriends().then(friends => this.render(friends));
    } 

    static addFriend(name, avatar, music) {
        FriendsList.addFriend(new Friend(name, avatar, music))
        .then(() => {
            return FriendsList.getAllFriends();
        })
        .then((friends) => this.render(friends)); 
    }

    static deleteFriend(id) {
        FriendsList.deleteFriend(id)
        .then(() => {
            return FriendsList.getAllFriends(); 
        })
        .then((friends) => this.render(friends)); 
    }

    static updateFriend(friend, avatar) {
        FriendsList.updateFriend(friend, avatar)
        .then(() => {
            return FriendsList.getAllFriends(); 
        })
        .then((friends) => this.render(friends)); 
    }

    static showForm(id) {
        const form = document.getElementById(`form-${id}`); 

        {
            if (form.style.display == 'block') {
                form.style.display = 'none'; 
            } else {
                form.style.display = 'block';
            }

        };   
        
    }  



    static render(friends) {
        this.friends = friends; 
        $('#app').empty(); 
        for (let friend of friends) {
            $('#app').prepend(
                `
            <div id="${friend.id}" class="card" style="width: 18rem;">
                <img src="${friend.avatar}" class="card-img-top" alt="image of user">
                <button id="edit" onclick="DOMManager.showForm(${friend.id})" type="button" class="btn btn-primary"><i class="fa-solid fa-pen-to-square"></i></button>
                <form id="form-${friend.id}" class="form-data">
                <div class="mb-3">
                <input type="url" class="form-control" id="new-avatar-${friend.id}" placeholder="URL:">
                </div>
                <button id="edit-pic-${friend.id}"  type="submit" class="btn btn-primary">Submit</button>
                </form>
                <h5 class="card-title"> ${friend.name}</h5>
             <div class="card-body">
              <p class="card-text">Favorite Song: ${friend.music}</p>
              <button class="btn btn-primary" onclick="DOMManager.deleteFriend('${friend.id}')">Delete Friend</button>
             </div>
             </div>
                `
                
            );
            
            $(`#edit-pic-${friend.id}`).on("click", (e) => {
                e.preventDefault(); 
                DOMManager.updateFriend(friend, $(`#new-avatar-${friend.id}`).val());
                $(`#new-avatar-${friend.id}`).val('');
                }); 

           
            
        }
        
        
    }
   
}


$('#add-friend').on("click", (e) => {
e.preventDefault(); 
DOMManager.addFriend($('#name').val(), $('#avatar').val(), $('#music').val());
console.log($('#name').val()); 
$('#name').val(''); 
$('#avatar').val(''); 
$('#music').val(''); 
}); 





DOMManager.getAllFriends(); 