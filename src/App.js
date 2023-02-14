import './App.css'
import Papa from 'papaparse'

function App() {
    const changeHandler = (event) => {
        // Passing file data (event.target.files[0]) to parse using Papa.parse
        Papa.parse(event.target.files[0], {
            header: true,
            skipEmptyLines: true,
            complete: function (results) {
                console.log(results.data)
            },
        })
    }
    return (
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
    )
}

export default App
