import logo from './images/logo.svg';
import './App.css';
import {useState} from "react";


function Header() {
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <img src={logo} className="App-logo" alt="logo" />
        &nbsp;Warhammer Dice Roller
      </div>
    </nav>
  );
}

function Body() {
  const [attacks, setAttacks] = useState(0);
  const [hit, setHits] = useState(0);
  const [strength, setStrength] = useState(0);
  const [toughness, setToughness] = useState(0);
  const [result, setResult] = useState('');

  function handleAttacksChange(e) {
    setAttacks(e.target.value);
  }

  function handleHitsChange(e) {
    setHits(e.target.value);
  }

  function handleStrengthChange(e) {
    setStrength(e.target.value);
  }

  function handleToughnessChange(e) {
    setToughness(e.target.value);
  }
  function handleReset(e) {

    e.preventDefault();

    setAttacks('');
    setHits('');
    setResult('');
    setStrength('');
    setToughness('');
  }

  async function handleRoll(e) {
    e.preventDefault();
    try {
      let res;
      res = await calculateRoll(parseInt(attacks), parseInt(hit), parseInt(strength), parseInt(toughness));

      setResult(res);
    } catch (err) {
      setResult(err);
    }
  }

  return (
    <div className="text-center m-5">
      <p className="fw-bold text-uppercase">Basic <span className="text-danger">Hit & Wound</span> roller</p>
      <form onSubmit={handleRoll} className="form">
          <div className="form-group">
            <div className="input-group mb-3">
              <div className="input-group-prepend">
                <span className="input-group-text" id="attacks">Number of attacks</span>
              </div>
              <input
                type="number"
                className="form-control"
                placeholder="Attacks"
                value={parseInt(attacks)}
                onChange={handleAttacksChange}
                aria-label="Attacks" aria-describedby="attacks"
              />
            </div>
          </div>
          <div className="form-group">
            <div className="input-group mb-3">
              <div className="input-group-prepend">
                <span className="input-group-text" id="bsws">Weapon/Balistic Skill</span>
              </div>
              <input
                type="number"
                className="form-control"
                placeholder="WS/BS"
                value={parseInt(hit)}
                onChange={handleHitsChange}
                aria-label="WS/BS" aria-describedby="bsws"
              />
            </div>
          </div>
          <div className="form-group">
            <div className="input-group mb-3">
              <div className="input-group-prepend">
                <span className="input-group-text" id="strength">Weapon's Strength</span>
              </div>
              <input
              type="number"
              className="form-control"
              placeholder="S"
              value={parseInt(strength)}
              onChange={handleStrengthChange}
              aria-label="S" aria-describedby="strength"
            />
            </div>
          </div>
          <div className="form-group">
            <div className="input-group mb-3">
              <div className="input-group-prepend">
                <span className="input-group-text" id="tough">Target's Toughness</span>
              </div>
              <input
              type="number"
              className="form-control"
              placeholder="T"
              value={parseInt(toughness)}
              onChange={handleToughnessChange}
              aria-label="T" aria-describedby="tough"
            />
            </div>
          </div>
        {/*le reste*/}

        <span>{parseInt(attacks)} attaque(s) qui toucheront sur {parseInt(hit)}+</span><br/><br/>
        <button className="btn btn-primary">Roll</button>&nbsp;
        <button className="btn btn-danger" onClick={handleReset}>Reset</button>
        <div className="text-wrap pt-4" dangerouslySetInnerHTML={{__html: result}}>

        </div>
      </form>
    </div>
  );
}

function Footer() {
  return (
    <footer className="fixed-bottom d-flex flex-column flex-sm-row justify-content-between align-items-bottom footer border-top py-2 ">
      <div>
        <span className="fw-bold text-white align-text-bottom">WDRX v0.1.4 by <a href="https://github.com/nfrugier" target="_blank">Thrandal</a></span>
      </div>
    </footer>
  );
}
function calculateRoll(attacks, hit, strength, toughness) {
  let returnString = 'Aucune info pour faire le jet <br><a href="https://perdu.com" target="_blank">Se retrouver</a>';
  if (attacks > 0 && hit > 0) {
    let diceRolls = attacks;
    let successes = 0;
    let rolls = [];
    while (diceRolls > 0) {
      let diceRoll = rollDice(1,6);
      rolls.push(diceRoll);
      if (diceRoll >= hit) {
        successes += 1;

      }
      diceRolls -= 1;
    }
    if (successes > 0 && strength > 0 && toughness > 0) {
      let woundRolls = successes;
      let woundTarget = 0;
      let woundResults = [];
      let woundSuccesses = 0;

      switch (true) {
        case (parseInt(strength) === parseInt(toughness)):
          woundTarget = 4;
          break;
        case (parseInt(strength) >= parseInt(toughness) * 2):
          woundTarget = 2;
          break;
        case (parseInt(strength) > parseInt(toughness)):
          woundTarget = 3;
          break;
        case (parseInt(strength) <= parseInt(toughness) / 2):
          woundTarget = 6;
          break;
        case (parseInt(strength) < parseInt(toughness)):
          woundTarget = 5;
          break;
      }
      while (woundRolls > 0) {
        let diceRoll = rollDice(1,6);
        woundResults.push(diceRoll);
        if (diceRoll >= woundTarget) {
          woundSuccesses += 1;

        }
        woundRolls -= 1;
      }
      rolls.forEach((element, index, array) => {
        switch (true) {
          case (element === 1):
            array[index] = '<span class="text-danger fw-bold">' + element + "</span>";
            break;
          case (element < hit):
            array[index] = '<span class="text-warning fw-bold">' + element + "</span>";
            break;
          case (element === 6):
            array[index] = '<span class="text-success fw-bold">' + element + "</span>";
            break;
          case (element >= hit):
            array[index] = '<span class="text-info fw-bold">' + element + "</span>";
            break;
        }
      })
      let stringRolls = rolls.join(', ');
      woundResults.forEach((element, index, array) => {
        switch (true) {
          case (element === 1):
            array[index] = '<span class="text-danger fw-bold">' + element + "</span>";
            break;
          case (element < woundTarget):
            array[index] = '<span class="text-warning fw-bold">' + element + "</span>";
            break;
          case (element === 6):
            array[index] = '<span class="text-success fw-bold">' + element + "</span>";
            break;
          case (element >= woundTarget):
            array[index] = '<span class="text-info fw-bold">' + element + "</span>";
            break;
        }
      })
      let stringWoundResults = woundResults.join(', ');
      returnString = '<b>'+ attacks + ' attaques sur ' + hit + '+</b><br>'+ successes + ' touches<br>Dés : ' + stringRolls +
        '<br>F ' + strength + ' vs E ' + toughness + ' = <b>blesse sur ' + woundTarget + '+</b><br>'
        + woundSuccesses + ' blessures<br>Dés : ' + stringWoundResults
      return returnString;
    } else if (successes === 0) {
      rolls.forEach((element, index, array) => {
        switch (true) {
          case (element === 1):
            array[index] = '<span class="text-danger fw-bold">' + element + "</span>";
            break;
          case (element < hit):
            array[index] = '<span class="text-warning fw-bold">' + element + "</span>";
            break;
          case (element === 6):
            array[index] = '<span class="text-success fw-bold">' + element + "</span>";
            break;
          case (element >= hit):
            array[index] = '<span class="text-info fw-bold">' + element + "</span>";
            break;
        }
      })
      let stringRolls = rolls.join(', ');
      returnString = '<b>'+ attacks + ' attaques sur ' + hit + '+</b><br>'+ successes + ' touches<br>Dés : ' + stringRolls;
      return returnString;
    } else {
      rolls.forEach((element, index, array) => {
        switch (true) {
          case (element === 1):
            array[index] = '<span class="text-danger fw-bold">' + element + "</span>";
            break;
          case (element < hit):
            array[index] = '<span class="text-warning fw-bold">' + element + "</span>";
            break;
          case (element === 6):
            array[index] = '<span class="text-success fw-bold">' + element + "</span>";
            break;
          case (element >= hit):
            array[index] = '<span class="text-info fw-bold">' + element + "</span>";
            break;
        }
      })
      let stringRolls = rolls.join(', ');
      returnString = '<b>'+ attacks
        + ' attaques sur ' +
         hit + '+</b><br>'+ successes
         + ' touches<br>Dés : '+ stringRolls +'<br>Mais pas de Force d\'arme ou d\'Endurance de cible';
      return returnString;
    }
  } else {
    return returnString;
  }
}

function rollDice(min, max) {

  let byteArray = new Uint8Array(1);
  window.crypto.getRandomValues(byteArray);

  let range = max - min + 1;
  let maxRange = 256;
  if (byteArray[0] >= Math.floor(maxRange / range) * range) {
    return rollDice(min, max);
  }

  return min + (byteArray[0] % range);
}
export default function Calculator() {
  return (
    <div>
      <Header/>
      <Body />
      <Footer/>
    </div>
  )
}
