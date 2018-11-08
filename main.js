function bufferToString(buffer) {
    let string = "";
    let offset = 0;
    buffer = new DataView(buffer);
    for (; offset < buffer.byteLength - 1;) {
        string += String.fromCharCode(buffer.getUint16(offset, true));
        offset += 2;
    }
    return string;
}

const escapeHTML = (() => {
    let buf = {
        '"': "&quot;",
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;"
    };
    return messageFormat => messageFormat.replace(/[\"&<>]/g, off => buf[off]);
})();

let ws = new WebSocket("wss://selftoolz.us:5823");
ws.binaryType = "arraybuffer";
ws.onopen = () => console.log("Connection Opened");
ws.onmessage = msg => {
    let buffer = new DataView(msg.data);
    let opCode = buffer.getUint8(0);
    switch (opCode) {
        case 0: // refresh
            const list = JSON.parse(bufferToString(msg.data.slice(1, buffer.byteLength)));
            let i = 1;
            let toAppend = '';
            for (let person in list) {
                toAppend += `<div class="anotherAutist"><span class="pos">${i++}.</span><span class="autisticName">${escapeHTML(person)}</span> <span class="autistReason">${escapeHTML(list[person])}</span></div>`;
            }
            document.getElementById('autists').innerHTML = toAppend;
            addBind();
            break;
        case 1: // login
            if (buffer.getUint8(1) == 0) {
                swal({
                    title: "Admin",
                    text: "Logged in!",
                    icon: "success"
                });
                $('.addAnotherAutist').fadeIn();
                closeAutist()
                $('.autistLogin').css('pointer-events', 'none');
                $('.autistLogin').text('Admin')
            } else {
                swal({
                    title: "Admin",
                    text: "Incorect password!",
                    icon: "error"
                });
            }
            break;
        case 2: // add person
            switch (buffer.getUint8(1)) {
                case 0:
                    swal({
                        title: "Add a autist",
                        text: "Successfuly added!",
                        icon: "success"
                    });
                    closeAutist()
                    $('.name, .reason').val('')
                    refreshUsers()
                    break;
                case 1:
                    swal({
                        title: "Add a autist",
                        text: "You don't have admin!",
                        icon: "error"
                    });
                    closeAutist()
                    break;
                case 2:
                    swal({
                        title: "Add a autist",
                        text: "The character limit is between 3-200!",
                        icon: "error"
                    });
                    break;
            }
            break;
        case 3: // edit user
            switch (buffer.getUint8(1)) {
                case 0:
                    swal({
                        title: "Edit an autist",
                        text: "Successfuly edited!",
                        icon: "success"
                    });
                    refreshUsers()
                    closeAutist()
                    break;
                case 1:
                    swal({
                        title: "Edit an autist",
                        text: "You don't have admin!",
                        icon: "error"
                    });
                    closeAutist()
                    break;
                case 2:
                    swal({
                        title: "Edit an autist",
                        text: "Autist not found!",
                        icon: "error"
                    });
                    break;
            }
            break;
        case 4: // delete user
            switch (buffer.getUint8(1)) {
                case 0:
                    swal({
                        title: "Delete an autist",
                        text: "Successfuly deleted!",
                        icon: "success"
                    });
                    refreshUsers()
                    break;
                case 1:
                    swal({
                        title: "Delete an autist",
                        text: "Autist not found!",
                        icon: "error"
                    });
                    break;
                case 2:
                    swal({
                        title: "Delete an autist",
                        text: "You don't have admin!",
                        icon: "error"
                    });
                    break;
            }
            break;
    }
};

function refreshUsers() {
    if (ws.readyState == WebSocket.OPEN)
        ws.send(new Uint8Array([0]));
}

function login(password) {
    let buffer = new DataView(new ArrayBuffer(1 + (password.length * 2)));
    let offset = 0;
    buffer.setUint8(offset++, 1);
    for (let i of password) {
        buffer.setUint16(offset, i.charCodeAt(0), true)
        offset += 2;
    }
    if (ws.readyState == WebSocket.OPEN)
        ws.send(buffer);
}

function addUser(name, reason) {
    let person = {};
    person.name = name;
    person.reason = reason;
    person = JSON.stringify(person);
    let buffer = new DataView(new ArrayBuffer(1 + (person.length * 2)));
    let offset = 0;
    buffer.setUint8(offset++, 2);
    for (let i of person) {
        buffer.setUint16(offset, i.charCodeAt(0), true)
        offset += 2;
    }
    if (ws.readyState == WebSocket.OPEN)
        ws.send(buffer);
}

let autistOpen = false;

$(document).bind("contextmenu", e => {
    if (!$('.anotherAutist:hover').length && !$('.autistMenu:hover').length)
        $('.autistMenu').hide(), autistOpen = false;
    if (e.preventDefault)
        e.preventDefault();
    else
        e.stopPropagation();
});

$(document).bind("click", e => {
    if (!$('.anotherAutist:hover').length && !$('.autistMenu:hover').length)
        $('.autistMenu').hide(), autistOpen = false;
    if (e.preventDefault)
        e.preventDefault();
    else
        e.stopPropagation();
});

$('.autistMenu').click(e => {
    if (e.preventDefault)
        e.preventDefault();
    else
        e.stopPropagation();
})

function addBind() {
    $('.anotherAutist').bind("contextmenu", e => {
        if (!checkAdmin()) return;
        $('.autistMenu').show();
        $(".autistMenu").offset({ left: e.pageX, top: e.pageY });
        $('.autistName').text(escapeHTML(getAutistName()))
        getAutistReason();
        if (e.preventDefault)
            e.preventDefault();
        else
            e.stopPropagation();
    });
}

function checkAdmin() {
    return document.getElementsByClassName('autistLogin')[0].innerText == "Admin";
}

let lastHovered = '';
let lastHoveredReason = '';

function getAutistName() {
    let userBeingHovered = $('.anotherAutist:hover');
    let a = userBeingHovered.find('.autisticName').text() || lastHovered || "";
    if (userBeingHovered.length)
        lastHovered = a;
    return a;
}

function getAutistReason() {
    let userBeingHovered = $('.anotherAutist:hover');
    let a = userBeingHovered.find('.autistReason').text() || lastHoveredReason || "";
    if (userBeingHovered.length)
        lastHoveredReason = a;
    return a;
}

function editAutist() {
    $('.editName').val(lastHovered);
    $('.editReason').val(lastHoveredReason);
    $('.overlay3').fadeIn();
}

function closeAutist() {
    $('.overlay, .overlay2, .overlay3').fadeOut();
    $('.name, .reason, .editName, .editReason').val('')
}

function sendEdit() {
    let send = JSON.stringify({
        "oldName": getAutistName(),
        "name": $('.editName').val(),
        "reason": $('.editReason').val()
    });
    let buffer = new DataView(new ArrayBuffer(1 + (send.length * 2)));
    let offset = 0;
    buffer.setUint8(offset++, 3);
    for (let i of send) {
        buffer.setUint16(offset, i.charCodeAt(0), true)
        offset += 2;
    }
    if (ws.readyState == WebSocket.OPEN)
        ws.send(buffer);
}

function deleteUser(autist) {
    let buffer = new DataView(new ArrayBuffer(1 + (autist.length * 2)));
    let offset = 0;
    buffer.setUint8(offset++, 4);
    for (let i of autist) {
        buffer.setUint16(offset, i.charCodeAt(0), true)
        offset += 2;
    }
    if (ws.readyState == WebSocket.OPEN)
        ws.send(buffer);
}

function confirmDelete(autist) {
    swal({
        title: "Delete a autist",
        text: `Are you sure you want to delete ${autist}?`,
        icon: "warning",
        buttons: true,
    }).then(deleteAutist => {
        if (deleteAutist) deleteUser(autist);
    });
}