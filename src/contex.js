import React, { Component } from 'react'
import items from './data';
import Client from './contenfull';





const RoomContext = React.createContext();

  class RoomProvider extends Component {
    state={
        rooms:[],
        sortedRooms:[],
        featuredRooms:[],
        loading:true,
        type:'all',
        capacity:1,
        price:0,
        maxPrice:0,
        minPrice:0,
        minSize:0,
        maxSize:0,
        breakfast:false,
        pets:false
    }

getData = async () => {
    try {
        let response = await Client.getEntries({
            content_type:"resortRoomsApp"
        });
            console.log(response.items)
   let rooms = this.formatData(response.items);
   console.log(rooms)
   let featuredRooms = rooms.filter(room => room.featured===true );
   let maxPrice =  Math.max(...rooms.map(item => item.price));
   let maxSize =  Math.max(...rooms.map(item => item.size));
   console.log(maxPrice);

   this.setState({rooms,
      featuredRooms,
       sortedRooms:rooms,
       loading:false,
         price:maxPrice,
         maxPrice,
         maxSize
     });
    } catch (error) {
        console.log(error);
    }
}
componentDidMount() {
  this.getData();
  console.log(items);
//    let rooms = this.formatData(items);
//    console.log(rooms)
//    let featuredRooms = rooms.filter(room => room.featured===true );
//    let maxPrice =  Math.max(...rooms.map(item => item.price));
//    let maxSize =  Math.max(...rooms.map(item => item.size));
//    console.log(maxPrice);

//    this.setState({rooms,
//       featuredRooms,
//        sortedRooms:rooms,
//        loading:false,
//          price:maxPrice,
//          maxPrice,
//          maxSize
//      });
}
formatData(items) {
    let tempItems = items.map(item=>{ 
let id = item.sys.id;
let images = item.fields.images.map(image => image.fields.file.url );
let room = {...item.fields, images, id};
return room;
    })
    return tempItems;
};
getRoom=(slug)=> {
    let tempRoom = [...this.state.rooms];
    const room = tempRoom.find(room => room.slug===slug);
    return room ;
};
handleChange = (event) => {
    const target = event.target
    const value =target.type ==='checkbox'? target.checked:target.value
    const name = event.target.name
this.setState({
    [name]:value
},this.filterRooms)

    console.log(target,name,value)
}
filterRooms = () => {
   let {
    rooms,type, capacity, price, maxPrice, minSize, maxSize, minPrice, breakfast, pets
   }= this.state
   let tempRooms = [...rooms];
   // transform value 
   capacity = parseInt(capacity);
   price = parseInt(price);

   // filter by capacity
if(capacity !==1) {
    tempRooms = tempRooms.filter(room => room.capacity>= capacity)
}

   // filter by type
   if(type!== 'all'){
       tempRooms =tempRooms.filter(room=> room.type === type)
   };
// filter range

   tempRooms =tempRooms.filter(room => room.price <= price)

   //fiter by price
   tempRooms =tempRooms.filter(room => room.size>=minSize && room.size <= maxSize);
   //filter by breakfast
   if(breakfast) {
       tempRooms= tempRooms.filter(rooms => rooms.breakfast===true)
   }
   //filter by pets
   if(pets) {
    tempRooms= tempRooms.filter(rooms => rooms.pets===true)
}
   this.setState({
       sortedRooms:tempRooms
   })
};
    render() {
        return (
            <RoomContext.Provider value={{...this.state, getRoom:this.getRoom, handleChange:this.handleChange}}>
                {this.props.children}
            </RoomContext.Provider>
        )
    }
}
const RoomConsumer = RoomContext.Consumer;

export {RoomProvider, RoomConsumer, RoomContext};