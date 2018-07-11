import Table from "./table";
import React, {Component} from "react";

class QueryResult extends Component{
    render(){
        return (
            <div className ='row mt-4 mr-3 ml-3'> 
                {this.props.result.length > 0 ? <div className="container mt-2 mb-4 alert alert-success" role="alert">
                    Note: The mismatched data entries are highlighted in red.
                </div> : ""}
                {
                    this.props.result.map((table, i) => {
                        return (
                            <div className = 'col-lg-6'>
                                <Table tbData= {table} key={i}/>
                            </div>
                        )
                    })
                }
            </div>
        )
    }
}

export default QueryResult;