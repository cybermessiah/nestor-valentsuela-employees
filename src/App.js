import './App.css'
import { useState } from 'react'
import Papa from 'papaparse'

function App() {
    const [parsedData, setParsedData] = useState([])

    const tableRows = [
        'Employee ID #1',
        'Employee ID #2',
        'Project ID',
        'Days worked',
    ]

    const dataToCalculate = parsedData

    var addPropertyNames = dataToCalculate.map((x) => ({
        EmpID: x[0].trim(),
        ProjectID: x[1].trim(),
        DateFrom: x[2].trim(),
        DateTo: x[3].trim(),
    }))

    const reformatDates = (addPropertyNames) => {
        return addPropertyNames.map(function (el) {
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

            return newObj
        })
    }

    let convertedDatesArray = reformatDates(addPropertyNames)

    const totalHoursPerProject = Object.values(
        convertedDatesArray.reduce((acc, item) => {
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

    const maxDaysWorked = Math.max(
        ...totalHoursPerProject.map((el) => el.CombinedDays),
    )

    let indexOfProject = ''

    totalHoursPerProject.some(function (el, i) {
        if (el.CombinedDays === maxDaysWorked) {
            indexOfProject = i
            return true
        }
        return false
    })

    const projectLongest = totalHoursPerProject[indexOfProject]?.ProjectID

    const employeePerProject = []

    addPropertyNames.forEach(function (el) {
        if (el.ProjectID === '10') {
            employeePerProject.push(el.EmpID)
        }
    })

    const changeHandler = (event) => {
        // Passing file data (event.target.files[0]) to parse using Papa.parse
        Papa.parse(event.target.files[0], {
            complete: function (results) {
                setParsedData(results.data)
            },
        })
    }
    return (
        <>
            <div>
                <input
                    type="file"
                    name="file"
                    accept=".csv"
                    onChange={changeHandler}
                    style={{ display: 'block', margin: '10px auto' }}
                />
            </div>
            <br />
            <table>
                <thead>
                    <tr>
                        {tableRows.map((rows, index) => {
                            return <th key={index}>{rows}</th>
                        })}
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        {employeePerProject.map((value, index) => {
                            return <td key={index}>{value}</td>
                        })}
                        <td>{projectLongest}</td>
                        <td>{maxDaysWorked}</td>
                    </tr>
                </tbody>
            </table>
        </>
    )
}

export default App
