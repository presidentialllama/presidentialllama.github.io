/*
author: Jason Swartzendruber
contact: jdswart2@svsu.edu
description: Code to make the golf scorecard buttons / totals work
*/

let rows = [];

// assign every table row to a variable, elem
for (let i = 1; i <= 18; i++) {
    rows[i] = document.getElementById(i.toString());
}

// add new clear button
rows.forEach((row) => {
    let clearBtn = document.createElement("button");
    clearBtn.classList.add("btn", "btn-warning");
    clearBtn.innerHTML = "C";

    // assign function to clear button
    clearBtn.onclick = () => {
        clear(row);
    };

    row.children[4].appendChild(clearBtn);
});

// assign a function to the + button
rows.forEach((row) => {
    row.children[4].children[0].onclick = () => {
        add1(row);
        calculateOver(row); // Update over when score is changed
        calculateTotal(); // Update totals when score is changed
    };
});

// assign a function to the - button
rows.forEach((row) => {
    row.children[4].children[1].onclick = () => {
        minus1(row);
        calculateOver(row); // Update over when score is changed
        calculateTotal(); // Update totals when score is changed
    };
});

// create an "add1" function
function add1(elem) {
    if (elem.children[2].innerHTML == "-") elem.children[2].innerHTML = "1";
    else {
        let currentScore = elem.children[2].innerHTML;
        currentScore = Number.parseInt(currentScore);
        elem.children[2].innerHTML = currentScore + 1;
    }
}

// create a "minus1" function
const minus1 = (elem) => {
    if (elem.children[2].innerHTML != "-") {
        let currentScore = elem.children[2].innerHTML;
        currentScore = Number.parseInt(currentScore);

        // Show dash instead of 0
        if (currentScore == 1) {
            elem.children[2].innerHTML = "-";
        } else {
            elem.children[2].innerHTML = currentScore - 1;
        }
    }
};

// Calculate how much above or below par we are
const calculateOver = (row) => {
    if (row.children[2].innerHTML != "-") {
        let par = Number.parseInt(row.children[1].innerHTML);
        let score = Number.parseInt(row.children[2].innerHTML);
        row.children[3].innerHTML = score - par;
    } else {
        row.children[3].innerHTML = "-";
    }
};

// Calculate totals for each column
const calculateTotal = () => {
    for (let i = 1; i <= 3; i++) {
        let sum = 0;
        rows.forEach((element) => {
            if (element.children[i].innerHTML != "-") {
                sum += Number.parseInt(element.children[i].innerHTML);
            }
        });

        totalsRow = document.getElementById("totals").children[i].innerHTML = sum;
    }
};

// Clear entire row
const clear = (row) => {
    row.children[2].innerHTML = "-";
    row.children[3].innerHTML = "-";

    // update over and totals
    calculateOver(row);
    calculateTotal();
};

calculateTotal(); // Call once to fill par
