// --- global variables ---

var loans = [
    { loan_year: 2020, loan_amount: 10000.0, loan_int_rate: 0.0453 },
    { loan_year: 2021, loan_amount: 10000.0, loan_int_rate: 0.0453 },
    { loan_year: 2022, loan_amount: 10000.0, loan_int_rate: 0.0453 },
    { loan_year: 2023, loan_amount: 10000.0, loan_int_rate: 0.0453 },
    { loan_year: 2024, loan_amount: 10000.0, loan_int_rate: 0.0453 },
];
let loanWithInterest = 0;

// --- function: loadDoc() ---

function loadDoc() {
    // load loans data from localstorage if anything is there, otherwise use defaults
    if (localStorage.getItem("loans") != null) {
        let loanJSON = JSON.parse(localStorage.getItem("loans"));

        loanJSON.forEach((loan, i) => {
            loans[i].loan_year = parseInt(loan["loan_year"]);
            loans[i].loan_amount = parseFloat(loan["loan_amount"]);
            loans[i].loan_int_rate = parseFloat(loan["loan_int_rate"]);
        });
    }
    // pre-fill defaults for first loan year
    var defaultYear = loans[0].loan_year;
    $("#loan_year0" + 1).val(defaultYear++);
    var defaultLoanAmount = loans[0].loan_amount;
    $("#loan_amt0" + 1).val(defaultLoanAmount.toFixed(2));
    var defaultInterestRate = loans[0].loan_int_rate;
    $("#loan_int0" + 1).val(defaultInterestRate);
    loanWithInterest = loans[0].loan_amount * (1 + loans[0].loan_int_rate);
    $("#loan_bal0" + 1).html(toComma(loanWithInterest.toFixed(2)));

    // pre-fill defaults for other loan years
    for (var i = 2; i < 6; i++) {
        $("#loan_year0" + i).val(defaultYear++);
        $("#loan_year0" + i).prop("disabled", true);
        $("#loan_year0" + i).css("background-color", "gray");
        $("#loan_year0" + i).css("color", "white");
        $("#loan_amt0" + i).val(loans[i - 1].loan_amount.toFixed(2));
        $("#loan_int0" + i).val(defaultInterestRate);
        $("#loan_int0" + i).prop("disabled", "true");
        $("#loan_int0" + i).css("background-color", "gray");
        $("#loan_int0" + i).css("color", "white");
        loanWithInterest = (loanWithInterest + defaultLoanAmount) * (1 + defaultInterestRate);
        $("loan_bal0" + i).html(toComma(loanWithInterest.toFixed(2)));
    } // end: "for" loop

    // all input fields: select contents on focus
    $("input[type=text]").focus(function () {
        $(this).select();
        $(this).css("background-color", "yellow");
    });
    $("input[type=text]").blur(function () {
        $(this).css("background-color", "white");
        updateLoansArray();
    });

    $("#loan_year01").focus();
} // end: function loadDoc()

function toComma(value) {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function toMoney(n) {
    return "$" + toComma(parseFloat(n.toFixed(2)));
}

function displayChanges() {
    loanWithInterest = 0;
    let balance = 0;
    for (let i = 1; i < 6; i++) {
        let amt = loans[i - 1].loan_amount;
        balance += parseFloat(amt);
        loanWithInterest = (loanWithInterest + parseFloat(amt)) * (1 + loans[0].loan_int_rate);
        $("#loan_year0" + i).val(loans[i - 1].loan_year);
        $("#loan_amt0" + i).val(amt);
        $("#loan_int0" + i).val(loans[i - 1].loan_int_rate);
        $("#loan_bal0" + i).text(toMoney(loanWithInterest));
    }
    int = loanWithInterest - balance;
    $("#loan_int_accrued").text(toMoney(int));
}

function updateLoansArray() {
    // year is between 1900-2099
    let yearRegex = /^(19|20)\d{2}$/;
    // amt has 0, 1, or 2 decimal places
    let amtRegex = /^([1-9][0-9]*)+(.[0-9]{1,2})?$/;
    // int is a fraction like 0.xxx, up to 5 digits after decimal
    let intRegex = /^(0|)+(.[0-9]{1,5})?$/;

    let ok = true;
    // test year field with regex
    if (!yearRegex.test($("#loan_year01").val())) {
        ok = false;
        $("#loan_year01").css("background-color", "coral");
    }

    // test amt field with regex
    for (let i = 1; i < 6; i++) {
        if (!amtRegex.test($("#loan_amt0" + i).val())) {
            ok = false;
            $("#loan_amt0" + i).css("background-color", "coral");
        }
    }

    //test int field with regex
    if (!intRegex.test($("#loan_int01").val())) {
        ok = false;
        $("#loan_int01").css("background-color", "coral");
    }

    // update loans array if all values are valid
    if (ok) {
        // loan year
        loans[0].loan_year = parseInt($("#loan_year01").val());
        for (var i = 1; i < 5; i++) {
            loans[i].loan_year = loans[0].loan_year + i;
            $("#loan_year0" + (i + 1)).val(loans[i].loan_year);
        }

        //loan amount
        for (let i = 1; i < 6; i++) {
            let amt = parseFloat($("#loan_amt0" + i).val()).toFixed(2);
            loans[i - 1].loan_amount = amt;
        }

        // loan int
        let rate = parseFloat($("#loan_int01").val());
        for (let i = 0; i < 5; i++) {
            loans[i].loan_int_rate = rate;
        }

        // save the form to local storage
        localStorage.setItem("loans", JSON.stringify(loans));
    }
}

// angular
var app = angular.module("app", []); //init

//create controller
app.controller("controller", function ($scope) {
    $scope.payments = []; // array of objects that will hold the payments

    // define function that will calculate payments
    // adapted from https://codepen.io/gpcorser/pen/pogEQJw
    $scope.display = function () {
        displayChanges();

        let balance = loanWithInterest;
        let intRate = loans[0].loan_int_rate;
        let r = intRate / 12;
        let n = 11;

        //loan payment formula
        let p = 12 * (balance / ((Math.pow(1 + r, n * 12) - 1) / (r * Math.pow(1 + r, n * 12))));

        // fill payments
        for (let i = 0; i < 10; i++) {
            balance -= p;
            let int = balance * intRate;
            $scope.payments[i] = {
                year: loans[4].loan_year + i + 1,
                amount: toMoney(p),
                interest: toMoney(int),
                yearEnd: toMoney((balance += int)),
            };
        }
        // set last payment
        $scope.payments[10] = {
            year: loans[4].loan_year + 11,
            amount: toMoney(balance),
            interest: toMoney(0),
            yearEnd: toMoney(0),
        };
    };
});
