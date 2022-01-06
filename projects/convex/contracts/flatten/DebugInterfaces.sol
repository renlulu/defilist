// File: @openzeppelin/contracts/math/SafeMath.sol

// SPDX-License-Identifier: MIT

pragma solidity >=0.6.0 <0.8.0;

/**
 * @dev Wrappers over Solidity's arithmetic operations with added overflow
 * checks.
 *
 * Arithmetic operations in Solidity wrap on overflow. This can easily result
 * in bugs, because programmers usually assume that an overflow raises an
 * error, which is the standard behavior in high level programming languages.
 * `SafeMath` restores this intuition by reverting the transaction when an
 * operation overflows.
 *
 * Using this library instead of the unchecked operations eliminates an entire
 * class of bugs, so it's recommended to use it always.
 */
library SafeMath {
    /**
     * @dev Returns the addition of two unsigned integers, with an overflow flag.
     *
     * _Available since v3.4._
     */
    function tryAdd(uint256 a, uint256 b) internal pure returns (bool, uint256) {
        uint256 c = a + b;
        if (c < a) return (false, 0);
        return (true, c);
    }

    /**
     * @dev Returns the substraction of two unsigned integers, with an overflow flag.
     *
     * _Available since v3.4._
     */
    function trySub(uint256 a, uint256 b) internal pure returns (bool, uint256) {
        if (b > a) return (false, 0);
        return (true, a - b);
    }

    /**
     * @dev Returns the multiplication of two unsigned integers, with an overflow flag.
     *
     * _Available since v3.4._
     */
    function tryMul(uint256 a, uint256 b) internal pure returns (bool, uint256) {
        // Gas optimization: this is cheaper than requiring 'a' not being zero, but the
        // benefit is lost if 'b' is also tested.
        // See: https://github.com/OpenZeppelin/openzeppelin-contracts/pull/522
        if (a == 0) return (true, 0);
        uint256 c = a * b;
        if (c / a != b) return (false, 0);
        return (true, c);
    }

    /**
     * @dev Returns the division of two unsigned integers, with a division by zero flag.
     *
     * _Available since v3.4._
     */
    function tryDiv(uint256 a, uint256 b) internal pure returns (bool, uint256) {
        if (b == 0) return (false, 0);
        return (true, a / b);
    }

    /**
     * @dev Returns the remainder of dividing two unsigned integers, with a division by zero flag.
     *
     * _Available since v3.4._
     */
    function tryMod(uint256 a, uint256 b) internal pure returns (bool, uint256) {
        if (b == 0) return (false, 0);
        return (true, a % b);
    }

    /**
     * @dev Returns the addition of two unsigned integers, reverting on
     * overflow.
     *
     * Counterpart to Solidity's `+` operator.
     *
     * Requirements:
     *
     * - Addition cannot overflow.
     */
    function add(uint256 a, uint256 b) internal pure returns (uint256) {
        uint256 c = a + b;
        require(c >= a, "SafeMath: addition overflow");
        return c;
    }

    /**
     * @dev Returns the subtraction of two unsigned integers, reverting on
     * overflow (when the result is negative).
     *
     * Counterpart to Solidity's `-` operator.
     *
     * Requirements:
     *
     * - Subtraction cannot overflow.
     */
    function sub(uint256 a, uint256 b) internal pure returns (uint256) {
        require(b <= a, "SafeMath: subtraction overflow");
        return a - b;
    }

    /**
     * @dev Returns the multiplication of two unsigned integers, reverting on
     * overflow.
     *
     * Counterpart to Solidity's `*` operator.
     *
     * Requirements:
     *
     * - Multiplication cannot overflow.
     */
    function mul(uint256 a, uint256 b) internal pure returns (uint256) {
        if (a == 0) return 0;
        uint256 c = a * b;
        require(c / a == b, "SafeMath: multiplication overflow");
        return c;
    }

    /**
     * @dev Returns the integer division of two unsigned integers, reverting on
     * division by zero. The result is rounded towards zero.
     *
     * Counterpart to Solidity's `/` operator. Note: this function uses a
     * `revert` opcode (which leaves remaining gas untouched) while Solidity
     * uses an invalid opcode to revert (consuming all remaining gas).
     *
     * Requirements:
     *
     * - The divisor cannot be zero.
     */
    function div(uint256 a, uint256 b) internal pure returns (uint256) {
        require(b > 0, "SafeMath: division by zero");
        return a / b;
    }

    /**
     * @dev Returns the remainder of dividing two unsigned integers. (unsigned integer modulo),
     * reverting when dividing by zero.
     *
     * Counterpart to Solidity's `%` operator. This function uses a `revert`
     * opcode (which leaves remaining gas untouched) while Solidity uses an
     * invalid opcode to revert (consuming all remaining gas).
     *
     * Requirements:
     *
     * - The divisor cannot be zero.
     */
    function mod(uint256 a, uint256 b) internal pure returns (uint256) {
        require(b > 0, "SafeMath: modulo by zero");
        return a % b;
    }

    /**
     * @dev Returns the subtraction of two unsigned integers, reverting with custom message on
     * overflow (when the result is negative).
     *
     * CAUTION: This function is deprecated because it requires allocating memory for the error
     * message unnecessarily. For custom revert reasons use {trySub}.
     *
     * Counterpart to Solidity's `-` operator.
     *
     * Requirements:
     *
     * - Subtraction cannot overflow.
     */
    function sub(uint256 a, uint256 b, string memory errorMessage) internal pure returns (uint256) {
        require(b <= a, errorMessage);
        return a - b;
    }

    /**
     * @dev Returns the integer division of two unsigned integers, reverting with custom message on
     * division by zero. The result is rounded towards zero.
     *
     * CAUTION: This function is deprecated because it requires allocating memory for the error
     * message unnecessarily. For custom revert reasons use {tryDiv}.
     *
     * Counterpart to Solidity's `/` operator. Note: this function uses a
     * `revert` opcode (which leaves remaining gas untouched) while Solidity
     * uses an invalid opcode to revert (consuming all remaining gas).
     *
     * Requirements:
     *
     * - The divisor cannot be zero.
     */
    function div(uint256 a, uint256 b, string memory errorMessage) internal pure returns (uint256) {
        require(b > 0, errorMessage);
        return a / b;
    }

    /**
     * @dev Returns the remainder of dividing two unsigned integers. (unsigned integer modulo),
     * reverting with custom message when dividing by zero.
     *
     * CAUTION: This function is deprecated because it requires allocating memory for the error
     * message unnecessarily. For custom revert reasons use {tryMod}.
     *
     * Counterpart to Solidity's `%` operator. This function uses a `revert`
     * opcode (which leaves remaining gas untouched) while Solidity uses an
     * invalid opcode to revert (consuming all remaining gas).
     *
     * Requirements:
     *
     * - The divisor cannot be zero.
     */
    function mod(uint256 a, uint256 b, string memory errorMessage) internal pure returns (uint256) {
        require(b > 0, errorMessage);
        return a % b;
    }
}

// File: contracts/DebugInterfaces.sol

// SPDX-License-Identifier: MIT
pragma solidity 0.6.12;
pragma experimental ABIEncoderV2;


interface IExchange {
    function swapExactTokensForTokens(
        uint256,
        uint256,
        address[] calldata,
        address,
        uint256
    ) external;
}

interface I3CurveFi {
    function get_virtual_price() external view returns (uint256);


    function add_liquidity(
        // sBTC pool
        uint256[3] calldata amounts,
        uint256 min_mint_amount
    ) external;
    
}

interface I2CurveFi {
    function get_virtual_price() external view returns (uint256);

    function add_liquidity(
        // eurs pool
        uint256[2] calldata amounts,
        uint256 min_mint_amount
    ) external;
    
    function claimable_tokens(address) external view returns (uint256);    
    function claimable_rewards(address,address) external view returns (uint256);    
}

interface ICurveAavePool {
    function get_virtual_price() external view returns (uint256);

    function add_liquidity(
        // aave pool
        uint256[3] calldata amounts,
        uint256 min_mint_amount,
        bool use_underlying
    ) external;
    
    function claimable_tokens(address) external view returns (uint256);    
    function claimable_rewards(address,address) external view returns (uint256);    
}

interface ISPool {
    function get_virtual_price() external view returns (uint256);

    function add_liquidity(
        // susd pool
        uint256[4] calldata amounts,
        uint256 min_mint_amount
    ) external;
    
    function claimable_tokens(address) external view returns (uint256);    
    function claimable_reward(address) external view returns (uint256);
    function claim_rewards(address) external;
}

interface ICurveGaugeController{
    function n_gauges() external view returns (uint256);
    function gauges(uint256) external view returns (address);
}

interface ICurveGaugeDebug {
    function claim_rewards(address) external;
    function claimable_tokens(address) external view returns (uint256);    
    function claimable_reward(address,address) external view returns (uint256);   
    function rewards_receiver(address) external view returns(address);
    function working_balances(address) external view returns(uint256);
    function working_supply() external view returns(uint256);
}

interface IWalletCheckerDebug{
    function approveWallet(address) external;
    function check(address) external view returns (bool);
}

interface IVoteStarter{
    function newVote(bytes calldata, string calldata, bool, bool) external returns (uint256);
    function votesLength() external view returns (uint256);
    function executeVote(uint256 _vid) external;
}

interface IBurner{
    function withdraw_admin_fees(address) external;
    function burn(address) external;
    function execute() external;
}

interface IClaim{
    function claim(address) external;
}

interface IEscro{
    function locked__end(address) external view returns(uint256);
    function smart_wallet_checker() external view returns(address);
}

interface ISnxRewards{
    function notifyRewardAmount(uint256) external;
}

interface IUniswapV2Router01 {
    function factory() external pure returns (address);
    function WETH() external pure returns (address);

    function addLiquidity(
        address tokenA,
        address tokenB,
        uint amountADesired,
        uint amountBDesired,
        uint amountAMin,
        uint amountBMin,
        address to,
        uint deadline
    ) external returns (uint amountA, uint amountB, uint liquidity);
    function addLiquidityETH(
        address token,
        uint amountTokenDesired,
        uint amountTokenMin,
        uint amountETHMin,
        address to,
        uint deadline
    ) external payable returns (uint amountToken, uint amountETH, uint liquidity);

    function swapExactETHForTokens(uint amountOutMin, address[] calldata path, address to, uint deadline)
      external
      payable
      returns (uint[] memory amounts);
}

interface IUniswapV2Factory {
    function getPair(address tokenA, address tokenB) external view returns (address pair);
}


interface Multicaller{
    struct Call {
        address target;
        bytes callData;
    }

    function aggregate(Call[] memory calls) external returns (uint256 blockNumber, bytes[] memory returnData);
}



interface MulticallerView{
    struct Call {
        address target;
        bytes callData;
    }
    function aggregate(Call[] memory calls) external view returns (uint256 blockNumber, bytes[] memory returnData);
}

interface IBaseRewards{
    function getReward(address,bool) external;
}

interface SushiChefV2{
    function deposit(uint256 pid, uint256 amount, address to) external;
    function withdraw(uint256 pid, uint256 amount, address to) external;
    function withdrawAndHarvest(uint256 pid, uint256 amount, address to) external;
    function add(uint256 allocPoint, address token, address rewarder) external;
    function set(uint256 pid, uint256 allocPoint, address rewarder, bool overwrite) external;
    function harvest(uint256 pid, address to) external;
    function harvestFromMasterChef() external;
    function poolInfo(uint256 pid) external view returns(uint128,uint64,uint64);
    function rewarder(uint256 pid) external view returns(address);
    function lpToken(uint256 pid) external view returns(address);
    function userInfo(uint256 pid, address account) external view returns(uint256, uint256);
    function pendingSushi(uint256 pid, address account) external view returns(uint256);
    function batch(bytes[] calldata calls, bool revertOnFail) external returns (bool[] memory successes, bytes[] memory results);
}

interface SushiChefV1{
    function set(uint256 pid, uint256 allocPoint, bool withUpdate) external;
}
