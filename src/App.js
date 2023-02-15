import './App.css'
import { useState } from 'react'
import Papa from 'papaparse'

function App() {
    // State to store parsed data
    const [parsedData, setParsedData] = useState([])

    const tableRows = [
        'Employee ID #1',
        'Employee ID #2',
        'Project ID',
        'Days worked',
    ]

    const dataToCalculate = parsedData

    var addNames = dataToCalculate.map((x) => ({
        EmpID: x[0].trim(),
        ProjectID: x[1].trim(),
        DateFrom: x[2].trim(),
        DateTo: x[3].trim(),
    }))
    // console.log(addNames)

    // Returns a new array of objects made up UNIX timestamp values.
    const reformatDates = (addNames) => {
        return addNames.map(function (el) {
            // create a new object to store the total days.
            var newObj = {}
            var dateToConverted = ''
            var dateFromConverted = ''
            if (el.DateFrom === 'null') {
                dateFromConverted = new Date()
            } else {
                dateFromConverted = new Date(el.DateFrom)
            }
            if (el.DateTo === 'null') {
                dateToConverted = new Date()
            } else {
                dateToConverted = new Date(el.DateTo)
            }
            var dateDiff = dateToConverted - dateFromConverted

            newObj['ProjectID'] = el.ProjectID
            newObj['DaysTotal'] = Math.ceil(dateDiff / (1000 * 60 * 60 * 24))

            // console.log(newObj)
            return newObj
        })
    }

    var fullNameArray = reformatDates(addNames)

    const totalHoursPerProject = Object.values(
        fullNameArray.reduce((acc, item) => {
            acc[item.ProjectID] = acc[item.ProjectID]
                ? {
                      ...item,
                      CombinedDays:
                          item.DaysTotal + acc[item.ProjectID].DaysTotal,
                  }
                : { ...item, CombinedDays: item.DaysTotal }
            return acc
        }, {}),
    )
    console.log(totalHoursPerProject)

    const maxDaysWorked = Math.max(
        ...totalHoursPerProject.map((el) => el.CombinedDays),
    )
    console.log(maxDaysWorked)

    const changeHandler = (event) => {
        // Passing file data (event.target.files[0]) to parse using Papa.parse
        Papa.parse(event.target.files[0], {
            complete: function (results) {
                // console.log(results.data)

                // Parsed Data Response in array format
                setParsedData(results.data)
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
                    {/* {values.map((value, index) => {
                        return (
                            <tr key={index}>
                                {value.map((val, i) => {
                                    return <td key={i}>{val}</td>
                                })}
                            </tr>
                        )
                    })} */}
                </tbody>
            </table>
            <div>
                <h3>Distinct Values</h3>
                <ul>
                    {/* {uniqueProjectsArray.map((name) => (
                        <li key={name}> {name} </li>
                    ))} */}
                </ul>
            </div>
        </>
    )
}

export default App
