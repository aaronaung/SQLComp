import React, { Component } from 'react';

class Table extends Component {
    render() {
        return (
            <div>
                <h4>{this.props.tbData.dbname}</h4>
                <table className="table">
                    <thead>
                        <tr>
                            {this.props.tbData.columns.map((item) => <th>{item}</th>)}
                        </tr>
                    </thead>
                    <tbody>
                        {this.props.tbData.data.map((row, i) =>
                            <tr className={this.props.tbData.mismatches.indexOf(i) === -1 ? "" : "mismatch"}>{row.map((data) => <td>{data}</td>)}</tr>
                        )}
                    </tbody>

                </table>
            </div>
        );
    }
}

export default Table;