import React, { Component } from 'react';
import {createClient} from '@supabase/supabase-js';

class App extends Component {
  constructor(props){
    super(props)

    this.dbChange = this.dbChange.bind(this);

    this.state = { 
        data: null,
        loading: true,
    }
  }
  
  async componentDidMount(){

    
    const supabaseURL = process.env.REACT_APP_SUPABASE_URL;
    const supabaseAnonkey = process.env.REACT_APP_SUPABASE_ANON_KEY;
    const supabase = createClient(supabaseURL, supabaseAnonkey)

    let { data, error } = await supabase
    .from('Job')
    .select('*')

    this.setState({
      data: data,
      loading: false,
    }, () => {
      console.log(this.state.data);
    })


const Job = supabase
.from('Job')
.on('*', payload => {
  console.log('Change received!', payload)
 
  if(payload.eventType === "INSERT"){
    console.log('insert');
    this.setState({
      data: [...this.state.data, payload.new]
    })
  }
  
  if(payload.eventType === "DELETE"){
    console.log('DELETE operation');
    let newdata = [...this.state.data]
    newdata.forEach((car,index) => {
      if(car.JobId === payload.old.JobId){
        console.log(`car found at: ${index}`);
        let removed = newdata.splice(index,1)
        console.log(removed);
      }
      console.log(newdata);
    })
    
    this.setState({
      data: newdata,
    })
   
    
  }
  
})
.subscribe()

  }

  dbChange(){

  }
  render() {
    return (
      <div>
        {this.state.loading && 
        <div>
          Loading...
        </div>}
        {!this.state.loading && this.state.data.map((car, index) => (
          <div key={index}>
            <h2>{car.RegNumber}</h2>
          </div>
        ))}
      </div>
    );
  }
}

export default App;
