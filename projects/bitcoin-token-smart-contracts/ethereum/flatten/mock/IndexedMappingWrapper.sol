// File: contracts/utils/IndexedMapping.sol

pragma solidity 0.4.24;


library IndexedMapping {

    struct Data {
        mapping(address=>bool) valueExists;
        mapping(address=>uint) valueIndex;
        address[] valueList;
    }

    function add(Data storage self, address val) internal returns (bool) {
        if (exists(self, val)) return false;

        self.valueExists[val] = true;
        self.valueIndex[val] = self.valueList.push(val) - 1;
        return true;
    }

    function remove(Data storage self, address val) internal returns (bool) {
        uint index;
        address lastVal;

        if (!exists(self, val)) return false;

        index = self.valueIndex[val];
        lastVal = self.valueList[self.valueList.length - 1];

        // replace value with last value
        self.valueList[index] = lastVal;
        self.valueIndex[lastVal] = index;
        self.valueList.length--;

        // remove value
        delete self.valueExists[val];
        delete self.valueIndex[val];

        return true;
    }

    function exists(Data storage self, address val) internal view returns (bool) {
        return self.valueExists[val];
    }

    function getValue(Data storage self, uint index) internal view returns (address) {
        return self.valueList[index];
    }

    function getValueList(Data storage self) internal view returns (address[]) {
        return self.valueList;
    }
}

// File: contracts/mock/IndexedMappingWrapper.sol

pragma solidity 0.4.24;



contract IndexedMappingWrapper {

    using IndexedMapping for IndexedMapping.Data;
    IndexedMapping.Data internal data;

    function add(address val) external returns (bool) {
        return data.add(val);
    }

    function remove(address val) external returns (bool) {
        return data.remove(val);
    }
 
    function exists(address val) external view returns (bool) {
        return data.exists(val);
    }

    function getValue(uint index) external view returns (address) {
        return data.getValue(index);
    }

    function getValueList() external view returns (address[]) {
        return data.getValueList();
    }
}
