
var sprintData;
var curr_sprint;
var data_size;
var curr_ticket;

var xhttp = new XMLHttpRequest();
xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
        sprintData = JSON.parse(this.responseText);
        data_size = sprintData.length;
        curr_sprint = 0;
        getSprint(0);
    }
};
xhttp.open("GET", "https://my-json-server.typicode.com/kathvillegas/demo/sprints", true);
xhttp.setRequestHeader('Access-Control-Allow-Origin', '*');
xhttp.send();

function getNextSprint() {
    if (this.curr_sprint < this.sprintData.length-1) {
        document.getElementById('prev-error').style.display = 'none';
        this.curr_sprint++;
        initTickets();
        getSprint(this.curr_sprint);
    } else if ( this.curr_sprint == this.sprintData.length-1) {
        document.getElementById('next-error').style.display = 'block';
    }
}

function getPrevSprint() {
    if (this.curr_sprint > 0) {
        document.getElementById('next-error').style.display = 'none';
        this.curr_sprint--;
        initTickets();
        getSprint(this.curr_sprint);
    } else if ( this.curr_sprint == 0) {
        document.getElementById('prev-error').style.display = 'block';
    }
}

function getSprint(index) {
    document.getElementById("current-sprint").innerHTML = this.sprintData[index].name + " " + this.sprintData[index].duration;
    getTickets(index);
}

function initTickets() {
    document.getElementById("new-tickets").innerHTML = "";
    document.getElementById("progress-tickets").innerHTML = ""
    document.getElementById("done-tickets").innerHTML = ""
}

function getTickets(index) {
    for (var i = 0; i < sprintData[index].tickets.new.length; i++) {
        document.getElementById("new-tickets").innerHTML +=
            '<div class="panel panel-default"><div class="panel-body">' +
            this.sprintData[index].tickets.new[i] +
            ' <span class="fa fa-remove pull-right ticket-close" id="close" data-type="new" ' +
            ' data-sprint="' + this.curr_sprint + '" ' + ' data-ticket="' + i + ' " '+
            '></span></div></div>';
    }
    for (var i = 0; i < sprintData[index].tickets.inProgress.length; i++) {
        document.getElementById("progress-tickets").innerHTML +=
            '<div class="panel panel-default"><div class="panel-body">' +
            this.sprintData[index].tickets.inProgress[i] +
            ' <span class="fa fa-remove pull-right ticket-close" id="close" data-type="progress" ' +
            ' data-sprint="' + this.curr_sprint + '" ' + ' data-ticket="' + i + ' " '+
            '></span></div></div>';
    }
    for (var i = 0; i < sprintData[index].tickets.done.length; i++) {
        document.getElementById("done-tickets").innerHTML +=
            '<div class="panel panel-default"><div class="panel-body">' +
            this.sprintData[index].tickets.done[i] +
            ' <span class="fa fa-remove pull-right ticket-close" id="close" data-type="done" ' +
            ' data-sprint="' + this.curr_sprint + '" ' + ' data-ticket="' + i + ' " '+
            '></span></div></div>';
    }
}

function getCategoryType(type) {
    if (type == 0) {
        document.getElementById("modalLabel").innerHTML = "Add new ticket";
        this.curr_ticket = 0;

    } else if (type == 1) {
        document.getElementById("modalLabel").innerHTML = "Add in progress ticket";
        this.curr_ticket = 1;

    } else if (type == 2) {
        document.getElementById("modalLabel").innerHTML = "Add done ticket";
        this.curr_ticket = 2;
    }
}

function saveTicket() {
    if (this.curr_ticket == 0) {

        this.sprintData[this.curr_sprint].tickets.new.push(document.getElementById("ticket-name").value)
        // add ticket to list of tickets of new ticket panel
        document.getElementById("new-tickets").innerHTML +=
            '<div class="panel panel-default"><div class="panel-body">' +
            document.getElementById("ticket-name").value +
            ' <span class="fa fa-remove pull-right ticket-close" id="close" data-type="done" ' +
            ' data-sprint="' + this.curr_sprint + '" ' + ' data-ticket="' + 
            this.sprintData[this.curr_sprint].tickets.new.length + ' " '+
            '></span></div></div>';
    }
    if (this.curr_ticket == 1) {

        this.sprintData[this.curr_sprint].tickets.inProgress.push(document.getElementById("ticket-name").value)
        // add ticket to list of tickets of progress ticket panel
        document.getElementById("progress-tickets").innerHTML +=
            '<div class="panel panel-default"><div class="panel-body">' +
            document.getElementById("ticket-name").value +
            ' <span class="fa fa-remove pull-right ticket-close" id="close" data-type="done" ' +
            ' data-sprint="' + this.curr_sprint + '" ' + ' data-ticket="' + 
            this.sprintData[this.curr_sprint].tickets.inProgress.length + ' " '+
            '></span></div></div>';
    }
    if (this.curr_ticket == 2) {
        console.log(document.getElementById("ticket-name").value)

        this.sprintData[this.curr_sprint].tickets.done.push(document.getElementById("ticket-name").value)
        // add ticket to list of tickets of done ticket panel
        document.getElementById("done-tickets").innerHTML +=
            '<div class="panel panel-default"><div class="panel-body">' +
            document.getElementById("ticket-name").value +
            ' <span class="fa fa-remove pull-right ticket-close" id="close" data-type="done" ' +
            ' data-sprint="' + this.curr_sprint + '" ' + ' data-ticket="' + 
            this.sprintData[this.curr_sprint].tickets.done.length + ' " '+
            '></span></div></div>';
    }

}

function deleteSprint() {
    this.sprintData.splice(this.curr_sprint, 1);
    if(this.curr_sprint == this.sprintData.length ) {
        this.curr_sprint--;
    }
    if(this.sprintData.length == 0) {
        document.getElementById("current-sprint").innerHTML = "";
        initTickets();
    
    } else {
        initTickets();
        getSprint(this.curr_sprint);
    }
}

function saveSprint() {
    var form = {
        name: document.getElementById('sprint-name').value,
        duration: document.getElementById('duration').value,
        tickets: {
            new: [],
            inProgress: [],
            done: []
        }
    }
    this.sprintData.push(form)
}



document.addEventListener('click', function(e){

    if(e.target && e.target.id == 'close'){
        var type = e.target.getAttribute('data-type');
        var sprint = e.target.getAttribute('data-sprint');
        var ticket = e.target.getAttribute('data-ticket');
        if(type == 'progress') {
            sprintData[sprint].tickets.inProgress.splice(ticket, 1);
        }
        else if (type == 'done' ) {
            sprintData[sprint].tickets.done.splice(ticket, 1);
        }
        else if (type == 'new' ) {
            sprintData[sprint].tickets.new.splice(ticket, 1);
        }
        initTickets();
        getSprint(sprint);
    }
 });