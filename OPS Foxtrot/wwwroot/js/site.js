// Please see documentation at https://docs.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

// Write your Javascript code.

$(document).ready(function () {
    startAnimation();
});

var STO_Names = [];
var STO_Locations = [];
var STO_Users = [];

async function getNames() {
    var url = 'https://gist.githubusercontent.com/zekesonxx/8fa351cf7cec21fe7c43/raw/0d9a416c3f1ceeef4859293e166f9fdab65c64ca/nato.json';
    var data = await fetch(url)
    STO_Names = await data.json();
}

async function getLocations() {
    var url = 'https://gist.githubusercontent.com/ahmu83/38865147cf3727d221941a2ef8c22a77/raw/c647f74643c0b3f8407c28ddbb599e9f594365ca/US_States_and_Cities.json';
    var data = await fetch(url)
    STO_Locations = await data.json();
}

async function createBots(amount) {
    await getNames();
    await getLocations();
    var arr_STO_Names = Object.keys(STO_Names);
    var arr_STO_Locations = Object.keys(STO_Locations);
    for (var a = 0; a <= amount; a++) {
        var id = a;
        var f_name = STO_Names[arr_STO_Names[Math.floor(Math.random() * arr_STO_Names.length)]];
        var l_name = STO_Names[arr_STO_Names[Math.floor(Math.random() * arr_STO_Names.length)]];
        var state = arr_STO_Locations[Math.floor(Math.random() * arr_STO_Locations.length)];
        var city = STO_Locations[state][Math.floor(Math.random() * STO_Locations[state].length)];
        var new_user = {
            "Id": id,
            "F-Name": f_name,
            "L-Name": l_name,
            "State": state,
            "City": city
        }
        console.log(new_user);
        STO_Users.push(new_user);
    }
}
createBots(10)

function checkData(data, str) {
    console.log(data);
    var fltr_data = [];
    for (var a in data) {
        for (var b in data[a]) {
            if (data[a][b].toString().toUpperCase().includes(str.toUpperCase())) {
                fltr_data.push(data[a]);
                break;
            }
        }
    }
    return fltr_data;
}

function animateRow(el, time) {
    setTimeout(function () {
        $(el).removeClass("o-0 pos-top h-0").find("h6").addClass("anim-blink");
    }, time);
}

function fillTable(data) {
    $("#dataTable").empty();
    if (data == undefined)
        data = STO_Users;
    for (var a in data) {
        var rowClass = "row" + a;
        var name = data[a]["F-Name"] + " " + data[a]["L-Name"];
        var location = data[a]["City"] + ", " + data[a]["State"];
        var tableRow = `
            <div class="` + rowClass + ` row mx-0 o-0 px-0 trans-sm h-0 pos-top" style="height: 40px; margin-top: 3px">
                <div class="h-100 d-flex px-3" style="width: 200px">
                    <h6 class="my-auto text-dark font-weight-normal">` + name + `</h6>
                </div>
                <div class="col d-flex px-3 h-100 trans-md">
                    <h6 class="my-auto text-dark font-weight-normal">` + location + `</h6>
                </div>
                <div class="h-100 d-flex" style="width: 40px">
                    <button class="slctBtn btn btn-info h-100 w-100 px-0 mx-0 m-auto border-0 rounded-0 d-flex" type="button" active="false">
                        <i class="material-icons text-white m-auto trans-sm">add</i>
                    </button>
                </div>
            </div>`;
        $("#dataTable").append(tableRow);
        animateRow("." + rowClass, 250 + (a * 50));
    }
}

function startAnimation() {
    $(".plank-lg").removeClass("flex-0");
    setTimeout(function () {
        $(".plank").each(function () {
            var el = $(this);
            $(this).find(".plankPlate").removeClass("w-0");
            setTimeout(function () {
                el.find(".plankStick").removeClass("h-0");
            }, 250);
        });
        setTimeout(function () {
            $("#queryInput").removeClass("pos-bottom").addClass("anim-blink");
            $("#dataSecondary").find(".row").removeClass("o-0").addClass("anim-blink");
            $("#dataSecondary").find(".col-0").removeClass("col-0").addClass("col");
            setTimeout(function () {
                $("#queryLabel").removeClass("pos-bottom");
                $("#dataTab, #dataSecondary").find(".innerBackground, .innerContent").removeClass("w-0").addClass("w-100");
                $("#dataTab").find(".dataType").removeClass("o-0").addClass("anim-blink");
                setTimeout(function () {
                    $("#dataSecondary").find("h6").removeClass("o-0").addClass("anim-blink");
                    $("#dataTab, #dataSecondary").find(".sqr").removeClass("w-0");
                    setTimeout(function () {
                        $("#dataTab, #dataSecondary").find(".sqr").find(".pos-top, .pos-bottom").removeClass("pos-top pos-bottom");
                        $("#dataTab, #dataSecondary").find(".sqrblk").removeClass("o-0");
                        fillTable();
                    }, 250)
                }, 500)
            }, 250);
        }, 250);
    }, 500);
}

$("#dataTable").on("click", ".slctBtn", function () {
    console.log("fired!")
    if ($(this).attr("active") == "false") {
        $(this).attr("active", "true");
        $(this).find("i").addClass("rotate-45");
        $(this).parent().parent().addClass("bg-dark toDelete").find("h6").removeClass("text-dark").addClass("text-white");
    } else {
        $(this).attr("active", "false");
        $(this).find("i").removeClass("rotate-45");
        $(this).parent().parent().removeClass("bg-dark toDelete").find("h6").removeClass("text-white").addClass("text-dark");
    }
});

$(".dltBtn").on("click", function () {
    $(".toDelete").addClass("o-0 pos-right h-0 mt-0");
    setTimeout(function () {
        $(".toDelete").remove();
    }, 250);
});

$(".qBtn").on("click", function () {
    fillTable(checkData(STO_Users, $("#queryInput").val()));
});
$("#queryInput").keypress((event) => {
    if (event.which == 13) {
        fillTable(checkData(STO_Users, $("#queryInput").val()));
    }
})