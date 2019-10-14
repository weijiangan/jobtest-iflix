const dayMilliseconds = 1000 * 60 * 60 * 24;
const offerTypes = {
  grant: "grant",
  revocation: "revocation"
};

export function processOffers(offers) {
  const state = { blockIndex: 0, currentPartner: null };
  const blocks = [];

  offers
    .sort((a, b) => {
      const diff = new Date(a.date) - new Date(b.date);
      if (diff === 0) {
        if (a.type !== b.type) {
          return a.type === offerTypes.revocation ? -1 : 1;
        }
      }
      return diff;
    })
    .forEach((offer, index) => {
      const offerDate = new Date(offer.date);

      if (!state.currentPartner && offer.type === offerTypes.grant) {
        const startDate = offerDate;
        const endDate = new Date(offer.date);
        endDate.setMonth(endDate.getMonth() + offer.period);

        blocks[index === 0 ? 0 : ++state.blockIndex] = {
          start: startDate,
          end: endDate,
          partner: offer.partner
        };

        state.currentPartner = offer.partner;
      } else {
        if (state.currentPartner && state.currentPartner !== offer.partner)
          return;

        if (offer.type === offerTypes.revocation) {
          blocks[state.blockIndex].end = offerDate;
          state.currentPartner = null;
          return;
        }

        if (offer.type === offerTypes.grant) {
          const { end, start } = blocks[state.blockIndex];
          end.setMonth(end.getMonth() + offer.period);
        }
      }
    });

  return blocks.reduce((acc, cur) => {
    acc[cur.partner] = Math.floor((cur.end - cur.start) / dayMilliseconds);
    return acc;
  }, {});
}
