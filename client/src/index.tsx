import ReactDOM from 'react-dom';
import './index.scss';
import 'semantic-ui-css/semantic.min.css'
import {makeAuthRouting} from "./routing";

ReactDOM.render(makeAuthRouting(), document.getElementById('root'))

