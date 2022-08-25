import logo from './logo.svg';
import './App.css';
import packageJson from './../package.json';
import preval from 'preval.macro';
import { RaportujPraceOrganizacji } from './raportowaniePracOrganizacji/RaportujPraceOrganizacji'

function App() {
  return (
    <div className="App" data_build_version={packageJson.version} data_build_time={preval`module.exports = new Date().toISOString();`}
      data_wiki="https://github.com/ar-insoft/raportowanie-zakonczonych-prac/wiki">
      <RaportujPraceOrganizacji />
    </div>
  );
}

export default App;
