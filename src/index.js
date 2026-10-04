"use strict";

// ChinaCarAPI is the China entry point of the encarapi package (one client for
// Korean and Chinese used car data). This package keeps the `chinacarapi` name
// and API: new ChinaCarAPI(key).catalog(), .vehicle(), .inspection(), .bulk(), ...
const { ChinaCarAPI, ChinaCarAPIError, EnCarAPI } = require("encarapi");

module.exports = { ChinaCarAPI, ChinaCarAPIError, EnCarAPI };
