import React from "react";
import { useState, useRef, useEffect } from "react";
import "./App.css"
import UpgradeState from "./classes/upgradeState";
import Button from "./components/button";
import { ClickHandler } from "./components/clickHandler";
import { DisplayStats } from "./components/displayStats";

export function App() {

  /*
    balanceRef is tracking the balance amount.
    balance is read only and is updated every 100ms.
    (by updating balance via setBalance whole page reloads
    and updates all button stages)
  */
  const balanceRef = useRef({ value: 0 })
  const [balance, setBalance] = useState(0);

  const upgradeMap = useRef(new Map<string, UpgradeState>([
    ['clickUpgrade', new UpgradeState(15, 1.1, 1, 0.1)],
    ['autoClicker01', new UpgradeState(15, 1.15, 0, 0.1)],
    ['autoClicker02', new UpgradeState(100, 1.15, 0, 1)],
    ['autoClicker03', new UpgradeState(1100, 1.15, 0, 8)],
    ['autoClicker04', new UpgradeState(12000, 1.15, 0, 45)]
  ]))

  let autoIncrement: number = Math.round(
    (upgradeMap.current.get('autoClicker01')!.increment +
      upgradeMap.current.get('autoClicker02')!.increment +
      upgradeMap.current.get('autoClicker03')!.increment +
      upgradeMap.current.get('autoClicker04')!.increment
    ) * 100) / 100;

  useEffect(() => {
    const interval = setInterval(() => {
      console.log('Attempting to invoke autoClicker components.');
      balanceRef.current.value = Math.round((balanceRef.current.value + (autoIncrement / 10)) * 100) / 100;
      setBalance(balanceRef.current.value);
    }, 100);

    return () => clearInterval(interval);
  });

  return (
    <>
      <div className="container-fluid">
        <div className="row">
          <div className="col-sm">
            <ClickHandler
              balanceRef={balanceRef}
              increment={upgradeMap.current.get('clickUpgrade')!.increment}
            />
            <DisplayStats 
              balanceRef={balanceRef}
              clickIncrement={upgradeMap.current.get('clickUpgrade')!.increment}
              autoIncrement={autoIncrement}
            />
          </div>
          <div className="col-sm">
            <h1>Upgrades</h1>
            <Button
              id="clickUpgrade"
              name="Click upgrade"
              level={upgradeMap.current.get('clickUpgrade')!.level}
              cost={upgradeMap.current.get('clickUpgrade')!.currentCost}
              increment={upgradeMap.current.get('clickUpgrade')!.incrementAdd}
              balance={balance}
              clickHandler={(id) => { upgradeInvocationHandler(id, upgradeMap, balanceRef); }}
            /> <br />
            <Button
              id="autoClicker01"
              name="Auto Clicker 1"
              level={upgradeMap.current.get('autoClicker01')!.level}
              cost={upgradeMap.current.get('autoClicker01')!.currentCost}
              increment={upgradeMap.current.get('autoClicker01')!.incrementAdd}
              balance={balance}
              clickHandler={(id) => { upgradeInvocationHandler(id, upgradeMap, balanceRef); }}
            /> <br />
            <Button
              id="autoClicker02"
              name="Auto Clicker 2"
              level={upgradeMap.current.get('autoClicker02')!.level}
              cost={upgradeMap.current.get('autoClicker02')!.currentCost}
              increment={upgradeMap.current.get('autoClicker02')!.incrementAdd}
              balance={balance}
              clickHandler={(id) => { upgradeInvocationHandler(id, upgradeMap, balanceRef); }}
            /> <br />
            <Button
              id="autoClicker03"
              name="Auto Clicker 3"
              level={upgradeMap.current.get('autoClicker03')!.level}
              cost={upgradeMap.current.get('autoClicker03')!.currentCost}
              increment={upgradeMap.current.get('autoClicker03')!.incrementAdd}
              balance={balance}
              clickHandler={(id) => { upgradeInvocationHandler(id, upgradeMap, balanceRef); }}
            /> <br />
            <Button
              id="autoClicker04"
              name="Auto Clicker 4"
              level={upgradeMap.current.get('autoClicker04')!.level}
              cost={upgradeMap.current.get('autoClicker04')!.currentCost}
              increment={upgradeMap.current.get('autoClicker04')!.incrementAdd}
              balance={balance}
              clickHandler={(id) => { upgradeInvocationHandler(id, upgradeMap, balanceRef); }}
            />
          </div>
        </div>
      </div>
    </>
  )
}

const upgradeInvocationHandler = (
  id: string,
  upgradeMap: React.MutableRefObject<Map<string, UpgradeState>>,
  balanceRef: React.MutableRefObject<{value: number;}>,
): void => {
  if (!upgradeMap.current.has(id)) {
    return;
  }

  const cost = upgradeMap.current.get(id)!.currentCost;

  if (upgradeMap.current.get(id)!.upgrade(balanceRef.current.value)) {
    console.log(`Upgraded ${id} component.`);
    balanceRef.current.value = Math.round((balanceRef.current.value - cost) * 100) / 100;
  } else {
    console.log(`Balance is too low to upgrade ${id} component.`)
  }
}