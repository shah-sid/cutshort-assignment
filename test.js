const transactionsArray = require('./transactions'); /* importing transactions from a different file */

const simplifyDebts = (transactions) => {

	const entities = ['paidBy', 'paidFor'];

	let targets = {}; /* targets is the object that stores entities and their values.
						Values can be positive signalling debt and negative signalling credit { 'A' : 100 } */

	transactions.forEach(transaction => {

		let paidForEntites = Object.keys(transaction[entities[1]]); /* convert the keys into an array to make iterable */

		paidForEntites.forEach(paidEntity => {


			if (targets[paidEntity])
				targets[paidEntity] += transaction[entities[1]][paidEntity]; /* if entity exists , add value */

			else
				targets[paidEntity] = 0 + transaction[entities[1]][paidEntity];


			if (targets[transaction[entities[0]]])
				targets[transaction[entities[0]]] -= transaction[entities[1]][paidEntity];

			else
				targets[transaction[entities[0]]] = 0 - transaction[entities[1]][paidEntity];
		});

	})


	let sortedArray = [];
	for (var target in targets) {
		sortedArray.push([target, targets[target]]);  /* [ [ 'B', 0 ],[ 'F', 622 ]]	   */
	}
	let data = [];

	while (sortedArray.filter((element) => !Boolean(element[1])).length != sortedArray.length) { /* loop runs till values of all the elements changes to 0 */


		let paidFor = {};
		let paidBy = {};

		sortedArray.sort((a, b) => b[1] - a[1]); /* sort array to decreasing */

		if (sortedArray[0][1] > -sortedArray[sortedArray.length - 1][1]) { /* if debt is greater than credit */

			paidBy[sortedArray[0][0]] = -sortedArray[sortedArray.length - 1][1]; /* add entry to the transaction { paidBy : { 'A' : 50 } } */

			paidFor[sortedArray[sortedArray.length - 1][0]] = -sortedArray[sortedArray.length - 1][1]; /* { paidFor: { A: 1204 } } */
			sortedArray[0][1] += sortedArray[sortedArray.length - 1][1];
			sortedArray[sortedArray.length - 1][1] = 0;


			while (sortedArray[0][1] != 0) { /* while the element is not zero , find for other elements which can be used in the same transaction. */

				let newMinNumberIndex = sortedArray.findIndex((a) => a[1] < 0 && a[1] >= -sortedArray[0][1]);

				if (newMinNumberIndex == -1) /* if no element is found , break the loop */
					break;

				paidBy[sortedArray[0][0]] -= sortedArray[newMinNumberIndex][1];
				paidFor[sortedArray[newMinNumberIndex][0]] = -sortedArray[newMinNumberIndex][1]; 
				sortedArray[0][1] += sortedArray[newMinNumberIndex][1];
				sortedArray[newMinNumberIndex][1] = 0;

			}
			data.push({ paidBy, paidFor });

		} else {


			paidBy[sortedArray[0][0]] = sortedArray[0][1];
			paidFor[sortedArray[sortedArray.length - 1][0]] = sortedArray[0][1];
			sortedArray[sortedArray.length - 1][1] += sortedArray[0][1];
			sortedArray[0][1] = 0;

			while (sortedArray[sortedArray.length - 1][1] != 0) {

				let newMinNumberIndex = sortedArray.findIndex((a) => a[1] > 0 && a[1] <= -sortedArray[sortedArray.length - 1][1]);

				if (newMinNumberIndex == -1)
					break;

				paidBy[sortedArray[newMinNumberIndex][0]] = sortedArray[newMinNumberIndex][1];
				paidFor[sortedArray[sortedArray.length - 1][0]] += sortedArray[newMinNumberIndex][1];
				sortedArray[sortedArray.length - 1][1] += sortedArray[newMinNumberIndex][1];
				sortedArray[newMinNumberIndex][1] = 0;
			}
			data.push({ paidBy, paidFor });
		}
	}
	return data;
}

let transactions = simplifyDebts(transactionsArray);
console.log(transactions);