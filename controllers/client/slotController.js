const Slot = require("../../models/Slot");
let slotController = module.exports;

slotController.getAllSlots = async (req, res) => {
  try {
    console.log("POST: client/getAllSlots");
    const slot = new Slot();
    const result = await slot.getAllSlotsData();
    res.json({ state: "success", data: result });
  } catch (err) {
    console.log(`ERROR, client/getAllSlots, ${err.message}`);
    res.json({ state: "fail", message: err.message });
  }
}

slotController.getChosenSlot = async (req, res) => {
  try {
    console.log("GET: client/getChosenSlot ");
    const slot = new Slot();
    const result = await slot.getChosenSlotData(id);
    res.json({ state: "success", data: result });
  } catch (err) {
    console.log(`ERROR, client/getChosenSlot, ${err.message}`);
    res.json({ state: "fail", message: err.message });
  }
}

slotController.createSlot = async (req, res) => {
  try {
    console.log("POST: client/createSlot");
    const slot = new Slot();
    const result = await slot.createSlotData(req.body);
    res.json({ state: "success", data: result });
  } catch (err) {
    console.log(`ERROR, client/createSlot, ${err.message}`);
    res.json({ state: "fail", message: err.message });
  }
}

slotController.updateSlot = async (req, res) => {
  try {
    console.log("POST: client/updateSlot");
    const slot = new Slot();
    const result = await slot.updateSlotData(req.params.id, req.body);
    res.json({ state: "success", data: result });
  } catch (err) {
    console.log(`ERROR, client/updateSlot, ${err.message}`);
    res.json({ state: "fail", message: err.message });
  }
}

slotController.removeSlot = async (req, res) => {
    try {
        console.log("POST: client/removeSlot");
        const slot = new Slot();
        const result = await slot.removeSlotData(req.params.id);
        res.json({ state: "success", data: result });
    } catch (err) {
        console.log(`ERROR, client/removeSlot, ${err.message}`);
        res.json({ state: "fail", message: err.message });
    }
    }