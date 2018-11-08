<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Top Autist List</title>
    <link rel="stylesheet" href="./main.css?v=<?php echo time() ?>">
</head>

<body>
    <h2>Welcome to the NEW list of Autists!</h2>
    <div id="autists"></div>
    <div class="autistMenu" style="left: 728px; top: 346px;">
        <span class="autistInfo autistName">----</span>
        <hr class="autistDivider">
        <span class="autistInfo" onclick="editAutist()">Edit Autist</span>
        <span class="autistInfo" onclick="confirmDelete(getAutistName())">Delete Autist</span>
    </div>

    <div class="loginToAutist">
        <span class="autistLogin" onclick="$('.overlay').fadeIn()">Login</span>
    </div>
    <div class="addAnotherAutist">
        <span class="autistPlus" onclick="$('.overlay2').fadeIn()">Add an Autist</span>
    </div>
    <div class="refreshAutistList">
        <span class="refreshAutist" onclick="refreshUsers()">Refresh List</span>
    </div>
    <div class="overlay">
        <div id="loginPanel">
            <h3>Login</h3>
            <input type="password" placeholder="Password" class="password">
            <button class="loginAutist cancelAutist" onclick="closeAutist()">Cancel</button>
            <button class="loginAutist" onclick="login($('.password').val())">Login</button>
        </div>
    </div>
    <div class="overlay2">
        <div id="addAutistPanel">
            <h3>Add an Autist</h3>
            <input type="text" placeholder="Autist's Name" class="name">
            <textarea placeholder="Reason of Autism" class="reason"></textarea>
            <button class="addAutist cancelAddAutist" onclick="closeAutist()">Cancel</button>
            <button class="addAutist" onclick="addUser($('.name').val(), $('.reason').val())">Add</button>
        </div>
    </div>
    <div class="overlay3">
        <div id="editAutistPanel">
            <h3>Edit an Autist</h3>
            <input type="text" placeholder="Autist's Name" class="editName">
            <textarea placeholder="Reason of Autism" class="editReason"></textarea>
            <button class="editAutist cancelEditAutist" onclick="closeAutist()">Cancel</button>
            <button class="editAutist" onclick="sendEdit()">Edit</button>
        </div>
    </div>
    <footer id="copyright">
        <xaz>Autists provided by Razor & Nosx (gary)</xaz>
        <xaz>Website developed by xAz & DaRealSh0T</xaz>
    </footer>
    <script src="https://unpkg.com/sweetalert/dist/sweetalert.min.js"></script>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js"></script>
    <script src="./main.js?autists=<?php echo time() ?>"></script>
</body>