import React from 'react'
import {Bar} from 'react-chartjs-2';

const BOOKING_BUCKETS = {
  'Cheap' : {
    min:0,
    max:99
  },
  'Normal' : {
    min: 99,
    max: 100
  },
  'Expensive': {
    min:100,
    max: Infinity
  }
}

const BookingsChart = (props) => {
  const chartData = {labels:[],datasets:[]};
  let values = [];
  for(const bucket in BOOKING_BUCKETS){
    const filteredBookingsCount = props.bookings.reduce((prev, current)=>{
      if(current.event.price > BOOKING_BUCKETS[bucket].min && current.event.price < BOOKING_BUCKETS[bucket].max){
        return prev + 1;
      }else{
        return prev;
      }      
    },0);
    // output[bucket] = filteredBookingsCount;
    values.push(filteredBookingsCount)
    chartData.labels.push(bucket);
    chartData.datasets.push({
      // label: 'My First dataset',
      backgroundColor: 'rgba(255,99,132,0.2)',
      borderColor: 'rgba(255,99,132,1)',
      borderWidth: 1,
      hoverBackgroundColor: 'rgba(255,99,132,0.4)',
      hoverBorderColor: 'rgba(255,99,132,1)',
      data: values,
    });
    values = [...values]
    values[values.length - 1] = 0;
    values = [0]
  }  
  return (
    <div style={{textAlign:'center'}}>
    <Bar
      data={chartData}
      width={100}
      height={250}
      options={{
        maintainAspectRatio: false
      }}
    />
    </div>
  )
}

export default BookingsChart
