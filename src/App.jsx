import store from "./app/store"
import { Provider } from "react-redux"

function App() {

  return (
    <>
    <Provider store={store}>
    
    </Provider>
   
    </>
  )
}

export default App
