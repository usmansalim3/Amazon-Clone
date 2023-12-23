import React, { useState } from 'react';
import DropDownPicker from 'react-native-dropdown-picker';
import { deals, images, item, list, offers } from "../data/data"
const MemoizedDropDownPicker = React.memo((props) => {
  const {
    category,
    setCategory,
    //onClose,
  } = props;
  const [open, setOpen] = useState(false);
  return (
    <DropDownPicker
      style={{
        marginBottom: open ? 180 : 20,
        height: 50,
        borderColor: "#B7B7B7",
      }}
      dropDownContainerStyle={{ borderColor: "#B7B7B7" }}
      open={open}
      setOpen={() => setOpen(true)}
      items={item}
      value={category}
      setValue={setCategory}
      onClose={() => setOpen(false)}
      placeholder="Choose Category"
    />
  );
});

export default MemoizedDropDownPicker;