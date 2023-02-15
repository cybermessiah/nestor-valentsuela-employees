import './App.css'
import { useState } from 'react'
import Papa from 'papaparse'

function App() {
    // State to store parsed data
    const [parsedData, setParsedData] = useState([])

    //State to store table Column name
    const [tableRows, setTableRows] = useState([])

    //State to store the values
    const [values, setValues] = useState([])

    const dataToCalculate = parsedData

    var addNames = dataToCalculate.map((x) => ({
        EmpID: x[0].trim(),
        ProjectID: x[1].trim(),
        DateFrom: x[2].trim(),
        DateTo: x[3].trim(),
    }))
    // console.log(addNames)

    // convert to Unix timestamp

    function convertDates(dateToConvert) {
        const date = new Date(dateToConvert)

        const timeInMillisecond = date.getTime()

        const unixTimestamp = Math.floor(date.getTime() / 1000)

        // console.log(unixTimestamp) // 1623801600
        return unixTimestamp
    }

    // Returns a new array of objects made up UNIX timestamp values.
    const reformatDates = (addNames) => {
        return addNames.map(function (el) {
            // create a new object to store the total days.
            var newObj = {}
            if (el.DateFrom === 'null') {
                newObj['DateFrom'] = new Date()
            } else {
                newObj['DateFrom'] = new Date(el.DateFrom)
            }
            if (el.DateTo === 'null') {
                newObj['DateTo'] = new Date()
            } else {
                newObj['DateTo'] = new Date(el.DateTo)
            }
            // var dateDiff = convertDates(el.DateTo) - convertDates(el.DateFrom)
            var dateDiff = newObj['DateTo'] - newObj['DateFrom']
            newObj['DaysTotal'] = Math.ceil(dateDiff / (1000 * 60 * 60 * 24))

            // return our new object.
            // console.log(newObj)
            return newObj
        })
    }

    var fullNameArray = reformatDates(addNames)
    console.log(fullNameArray)

    var uniqueProjectsArray = Array.from(
        new Set(addNames.map((x) => x.ProjectID)),
    ) // Unique Array ['a', 'b'];
    // console.log(uniqueProjectsArray)

    const changeHandler = (event) => {
        // Passing file data (event.target.files[0]) to parse using Papa.parse
        Papa.parse(event.target.files[0], {
            complete: function (results) {
                const rowsArray = []
                const valuesArray = []
                // console.log(results.data)
                // Iterating data to get column name and their values
                results.data.map((d) => {
                    rowsArray.push(Object.keys(d))
                    valuesArray.push(Object.values(d))
                })

                // Parsed Data Response in array format
                setParsedData(results.data)

                // Filtered Column Names
                setTableRows(rowsArray[0])

                // Filtered Values
                setValues(valuesArray)
            },
        })
    }
    return (
        <>
            <div>
                {/* File Uploader */}
                <input
                    type="file"
                    name="file"
                    accept=".csv"
                    onChange={changeHandler}
                    style={{ display: 'block', margin: '10px auto' }}
                />
            </div>
            <br />
            {/* Table */}
            <table>
                <thead>
                    <tr>
                        {tableRows.map((rows, index) => {
                            return <th key={index}>{rows}</th>
                        })}
                    </tr>
                </thead>
                <tbody>
                    {values.map((value, index) => {
                        return (
                            <tr key={index}>
                                {value.map((val, i) => {
                                    return <td key={i}>{val}</td>
                                })}
                            </tr>
                        )
                    })}
                </tbody>
            </table>
            <div>
                <h3>Distinct Values</h3>
                <ul>
                    {uniqueProjectsArray.map((name) => (
                        <li key={name}> {name} </li>
                    ))}
                </ul>
            </div>
        </>
    )
}

export default App
