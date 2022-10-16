import React,{useState,useMemo,useReducer,useEffect,useRef} from 'react'
import "./TableStyle.css"
import MOCK_DATA from "./MOCK_DATA.json"
function TableFilter() {
   const[user,setUser]= useState({id:0,first_name:'',last_name:'',country:'',date_of_birth:0}) //for extract keys
   const [taille,setTaille]=useState(10)  // taille of the page selected
   const [min,setMin]=useState(0)       
   const [endPage,setEndPage]=useState(false)
   const [firstPage,setFirst]=useState(false)
   const [page,setPage] =useState(1)   // numero of page
   const [InputFilter,setInputFilter]=useState('')   // the content of input
   const [typeInput,setTypeInput]=useState('first_name')    // the type of the input   
   let nbrOfRowsAfterfiltering=0;
   const columns = useMemo(()=>MOCK_DATA,[])  // our data from json
     
   const [columnArray,setColumnArray]=useState(columns)  // a copy of our data for filtering
   
   const headers=[];

    
  for (const key in user) {
     headers.push(key)                // ['id','first_name'.....]
    }
    
    // disable button of previous and next
    useEffect(()=>{
     if (nbrOfRowsAfterfiltering==0) {
         if ((min+taille)>=columns.length) {
           setEndPage(!endPage)
         } else {
            setEndPage(false)
         }
     } else {
        if ((min+taille)>=nbrOfRowsAfterfiltering) {
            setEndPage(!endPage)
          } else {
             setEndPage(false)
          }
     }
    },[min+taille])
    useEffect(()=>{
        if (min==0) {
            setFirst(!firstPage)
        } else {
            setFirst(false)
        }
    },[min])
   // if we click next
    const changeNext=(e)=>{
            setMin(prev=>prev+e)
     }
     //if we click previous
     const changePrev=(e)=>{
        setMin(prev=>prev-e)
     }
     
     let tempArray =[...columns]
     // order the rows + and -
    const OrderRowsplus=(e)=>{
 
        setColumnArray([...tempArray.sort((a,b)=>a[e].localeCompare(b[e]))])
   }
   const OrderRowsmoin=(e)=>{
    setColumnArray([...tempArray.sort((a,b)=>a[e].localeCompare(b[e])).reverse()])
}
  // just for hide input and sort of column id 
    document.querySelectorAll('.head').forEach(element => {
       if (element.dataset.head==='id') {
              element.style.display='none'
              element.nextElementSibling.style.display='none'
              element.nextElementSibling.nextElementSibling.style.display='none'
              element.nextElementSibling.nextElementSibling.nextElementSibling.style.display='none'
          }
     });

   // if we type in the input we return numero of page to 1 and min to 0 for display from begin
     const setToFirst=()=>{
        setMin(0)
        setPage(1)
     }
  return (
    <div>
                     
        <table>
            <thead>
                <tr>
                   {
                    headers.map((header,index)=>(
                        <th key={index}>
                            {header}
                            <input type="text" className='head' data-head={header} onChange={(e)=>{setInputFilter(e.target.value);setTypeInput(e.target.dataset.head); setToFirst()}} />    
                            <a onClick={()=>OrderRowsplus(header)}>&#9196;</a>
                            <a onClick={()=>OrderRowsmoin(header)}>&#9195;</a>
                            <a onClick={()=>setColumnArray(columns)}>&#10006;</a>
                        </th>
                    ))
                    
                } 
                     
                </tr>
            </thead>
            <tbody>
                {

                 //filter the data and then we dispaly the result by map
                        columnArray.filter(el => {
                        let condition = false;
                    
                        let reg = new RegExp(InputFilter.toLowerCase(), "g");
                        Object.keys(el).forEach(key => { 
                            if (key==typeInput) {
                             
                                if(el[key].toString().toLowerCase().match(reg)) {
                                    nbrOfRowsAfterfiltering++;
                                    condition = true;
                                }
                                   
                            }

                        });
                        return condition;
                    }).map((column,index)=>{
                         
                           if (index>=(min+taille)) {
                               return ;
                           } 
                          else if(index<(min+taille) && index>=min){
                           return(
                              <tr key={index} className='Row'> 
                              {
                                  Object.keys(user).map((ele,ind)=>{
                                      return (
                                          <td key={ind}>{column[ele]}</td>
                                          )
                                       })
                               }
                                   </tr>
                                )
                              }
                            })
                     
                }
            </tbody>
        </table>
        <div >
            <select value={taille} onChange={(e)=>{setTaille(Number(e.target.value));setToFirst()}}>
                <option  value="10">show 10</option>
                <option   value="25">show 25</option>
                <option  value="45">show 45</option>
            </select>
            <label>{nbrOfRowsAfterfiltering==0 ? (page>(Math.ceil((columns.length)/taille)) ? Math.ceil((columns.length)/taille):(page<=0 ? 1 :page)): (page>(Math.ceil((nbrOfRowsAfterfiltering)/taille)) ? Math.ceil((nbrOfRowsAfterfiltering)/taille):(page<=0 ? 1 :page))} of {nbrOfRowsAfterfiltering==0? (Math.ceil((columns.length)/taille)):(Math.ceil((nbrOfRowsAfterfiltering)/taille))}
            <input type="number" style={{width:"40px"}} onChange={(e)=>{(e.target.value>Math.ceil((columns.length)/taille) ?setMin((Math.ceil((columns.length)/taille)-1)*taille):(e.target.value<=1?setMin(0):setMin((e.target.value-1)*taille)));setPage(Number(e.target.value))}} />
            </label>
            <button disabled={firstPage} onClick={()=>{changePrev(taille);setPage(prev=>prev-1)}} >Previous</button>
            <button disabled={endPage} onClick={()=>{changeNext(taille);setPage(prev=>prev+1)}}>Next</button>
           
        </div>
              
    </div>
  )
}

export default TableFilter


 