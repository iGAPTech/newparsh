import AsyncStorage from "@react-native-async-storage/async-storage";


export const changeUnits = (product)=>{
  let pUnits = [];
  if(product.type == "Meter"){
      if(product.billingin == "Meter"){
          pUnits.push({label:"Meter", value:"Meter"});
      }
      else if(product.billingin == "Feet"){
          pUnits.push({label:"Feet", value:"Feet"});
      }else{
          pUnits.push({label:"Meter", value:"Meter"});
          pUnits.push({label:"Feet", value:"Feet"});
          pUnits.push({label:"Nos", value:"Nos"});
      }
  }else{
      pUnits.push({label:"Nos", value:"Nos"});
  }
  pUnits.push({label:"Kgs", value:"Kgs"});
  return pUnits;
}
