// @ts-check
import React from 'react';
import PropTypes from 'prop-types';
import Menu from 'antd/lib/menu';
import Dropdown from 'antd/lib/dropdown';
import Badge from 'antd/lib/badge';
import Avatar from 'antd/lib/avatar';
// import { NavLink } from 'react-router-dom';
import connect from "react-redux/es/connect/connect";
import {gradeConverter} from "../../market/helpers";
import Icon from "antd/lib/icon";
import img from '../../../app/images/Profile-Image-Logo-60x60.png';
import {setTransactionsSeen} from "../txActions";

require('antd/lib/dropdown/style/css');
require('antd/lib/badge/style/css');
require('antd/lib/menu/style/css');
require('antd/lib/avatar/style/css');


const menuItemContainer = {}

const geodeTypes = {
    '0': 'Small silver geode',
    '1': 'Rotund silver geode',
    '2': 'Goldish silver geode'
}

// const generateMenuItemForTx = tx => {
//     switch (tx.txMethod) {
//         case 'SILVER_SALE':
//             switch (tx.status) {
//                 case 'COMPLETED':
//                     return (
//                       <div>
//                           <p>
//                               Silver received: {tx.receipt.events.Unboxed.returnValues.silver + " "}
//                               {tx.receipt.events.Unboxed.returnValues.gold > 0 ?
//                                 "Gold received:" + tx.receipt.events.Unboxed.returnValues.gold : ""}
//                           </p>
//                           <p>
//                               Cost: {tx.ether} ETH {tx.points > 0 ? ', ' + tx.points + 'referral' +
//                             ' points' : ''}
//                           </p>
//                       </div>
//                     );
//                 case 'PENDING':
//                     return (
//                       <div>
//                           <p>
//                               Cost: {tx.ether} ETH {tx.points > 0 ? ', ' + tx.points + 'referral' +
//                             ' points' : ''}
//                           </p>
//                       </div>
//                     )
//             }
//             break;
//         case 'GEM_UPGRADE':
//             switch (tx.status) {
//                 case 'PENDING':
//                 case 'COMPLETED':
//                     return (
//                       <div>
//                           <p>
//                               From: grade {gradeConverter(tx.gem.gradeType)}, level {tx.gem.level}
//                           </p>
//                           <p>
//                               To: grade {gradeConverter(tx.gem.gradeType + tx.gradeUp)},
//                               level {tx.gem.level + tx.levelUp}
//                           </p>
//                           <p>Cost: {tx.cost} {tx.levelUp > 0 ? 'silver' : 'gold'}</p>
//                       </div>
//                     );
//             }
//             break;
//         case 'COUPON_USE':
//             switch (tx.status) {
//                 case 'COMPLETED':
//                     return (
//                       <div>
//                           <p>
//                               Received: {geodeTypes[tx.receipt.events.CouponConsumed.returnValues.boxType] + " "}
//                           </p>
//                           <p>
//                               {tx.receipt.events.CouponConsumed.returnValues.gold > 0 ?
//                                 "Additional Gold received:" + tx.receipt.events.CouponConsumed.returnValues.gold :
//                                 ""}
//                           </p>
//                           <p>
//                               {tx.receipt.events.CouponConsumed.returnValues.silver > 0 ?
//                                 "Additional Silver received:" + tx.receipt.events.CouponConsumed.returnValues.silver :
//                                 ""}
//                           </p>
//                       </div>
//                     );
//                 case 'PENDING':
//                     return (
//                       <div>
//                           <p>
//                               Code: {tx.code}
//                           </p>
//                       </div>
//                     )
//             }
//             break;
//         case 'PLOT_SALE':
//             switch (tx.status) {
//                 case 'COMPLETED':
//                     console.log('TX::', tx.receipt);
//                     return (
//                       <div>
//                           <p>
//                           </p>
//                           <p>
//                               Cost: {tx.price} ETH
//                           </p>
//                       </div>
//                     );
//                 case 'PENDING':
//                     return (
//                       <div>
//                           <p>
//                               Cost: {tx.price} ETH
//                           </p>
//                       </div>
//                     )
//             }
//             break;
//         default:
//
//             break;
//     }
// };


const generateMenuItemForTx = tx => {
    switch (tx.event) {

        case 'Updated':
            return (
              <div>
                  <p>Plot {tx.returnValues['plotId']} was mined.</p>
                  <p>From {tx.returnValues['offsetFrom']} to {tx.returnValues['offsetTo']}</p>
              </div>
            );
        case 'Bound':
            return (
              <div>
                  <p>Gem {tx.returnValues['gemId']} was bound to the plot {tx.returnValues['plotId']}</p>
              </div>
            );
        case 'Released':
            return (
              <div>
                  <p>Gem was released from the Plot {tx.returnValues['plotId']}</p>
              </div>
            );
        default:
            break;
    }
};

const menu = ({transactionHistory, pendingTransactions}) => (
  <Menu style={{maxHeight: '500px', overflowY: 'auto'}}>
      {!transactionHistory || !pendingTransactions || (transactionHistory.length === 0 && pendingTransactions.length === 0)
      && <Menu.Item>No recent transactions</Menu.Item>}
      {pendingTransactions && pendingTransactions.map((tx) => (
        tx.hash ?
          <Menu.Item className="flex aic" style={{
              backgroundColor: '#fff9bc',
              borderBottom: "1px solid white"
          }} key={tx.hash+'pending'}>
              <Badge count={tx.unseen ? 1 : 0}>
                  <a
                    href={`https://${process.env.REACT_APP_NETWORK}.io/tx/${tx.hash}`}
                    key={tx.hash}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                      <div style={{paddingRight: '30px'}}>
                          <p>Pending</p>
                          <p>{tx.description}</p>
                      </div>

                      <Icon type="link" style={{fontSize: '24px', position: 'absolute', top: '20px', right: '0px'}}
                            className="pointer blue"/>
                  </a>
              </Badge>
          </Menu.Item> : ""
      ))}
      {transactionHistory && transactionHistory.map((tx) => (
        tx.transactionHash ?
          <Menu.Item className="flex aic" style={{
              backgroundColor: '#e4ffe4',
              borderBottom: "1px solid white"
          }} key={tx.transactionHash+tx.event}>
              <Badge count={tx.unseen ? 1 : 0}>
                  <a
                    href={`https://${process.env.REACT_APP_NETWORK}.io/tx/${tx.transactionHash}`}
                    key={tx.transactionHash}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                      <div style={{paddingRight: '30px'}}>
                          <p>Event: {tx.event}</p>
                          {generateMenuItemForTx(tx)}
                      </div>

                      <Icon type="link" style={{fontSize: '24px', position: 'absolute', top: '20px', right: '0px'}}
                            className="pointer blue"/>
                  </a>
              </Badge>
          </Menu.Item> : ""
      ))}
  </Menu>
);

/**
 * @param {{
 * to: string,
 * userImage: string
 * userName: string
 * upperCaseWalletId: string
 * }} AvatarDropdownProps
 */
class AvatarDropdown extends React.Component {


    state = {
        visibility: false,
    };

    // const [visibility, setVisibility] = useState(false);
    // const [penidngTxs, setTxs] = useState([]);
    // useEffect(() => {
    //     const unsubscribe = fetchAnyPendingTransactions(upperCaseWalletId, setTxs);
    //     // console.log('listening');
    //     return () => unsubscribe();
    // }, []);
    // // console.log('walletId', walletId);
    // // console.log('penidngTxs', penidngTxs);
    //

    render() {

        const {user, userImage, userName, upperCaseWalletId, transactions, unseen, transactionHistory, pendingTransactions, handleSetTransactionsSeen} = this.props;

        console.log('USER RENDER:', user);

        return (
          user && (
            user.name && user.imageURL && user.walletId &&
            <div
              className="dib-ns"
              onMouseEnter={() => this.setState({visibility: true})}
              onMouseLeave={() => {
                  this.setState({visibility: false})
                  //todo transactions notifications
                  //handleSetTransactionsSeen(unseen);
              }}
            >
                <Dropdown overlay={menu({transactionHistory, pendingTransactions})} visible={this.state.visibility}>
                    <>
                        <Badge count={unseen}>
                            <Avatar src={user.imageURL} className="dib"/>
                        </Badge>
                        <p className="dib pl2">
                            {user.name}
                        </p>
                    </>
                </Dropdown>
            </div>
            || (user.name === 'Guest' && !user.imageURL && !user.walletId) &&
            //<Dropdown overlay={<></>} visible={this.state.visibility}>
            <div className="dib-ns">
                <Avatar src={img} className="dib"/>
                <p className="dib pl2">Guest</p>
            </div>
            //</Dropdown>
          ))
    };
}

const select = store => {
    console.log('AVATAR DROPDOWN STORE:', store);
    return {
        transactions: store.tx.transactions || [],
        unseen: store.tx.transactions ? store.tx.transactions.reduce((acc, curTx) => curTx.unseen ? acc + 1 : acc, 0) : 0,
        transactionHistory: store.tx.transactionHistory,
        pendingTransactions: store.tx.pendingTransactions,
        //hash: store.tx.txHash,
        //txConfirmations: store.tx.txConfirmations,
        //txReceipt: store.tx.txReceipt,
        //txError: store.tx.txError,
        //txCurrentUser: store.tx.txCurrentUser,
        //txMethod: store.tx.txMethod,
        //txTokenId: store.tx.txTokenId,
    }
};

const actions = {
    handleSetTransactionsSeen: setTransactionsSeen,
}

export default connect(select)(AvatarDropdown);

AvatarDropdown.propTypes = {
    // to: PropTypes.string.isRequired,
    //userImage: PropTypes.string.isRequired,
    //userName: PropTypes.string.isRequired,
    // walletId: PropTypes.string,
    upperCaseWalletId: PropTypes.string.isRequired,
};

// AvatarDropdown.defaultProps = {
//   walletId: '',
// };
