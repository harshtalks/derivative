import { EffectCallback, useEffect } from "react";

const useOneTimeEffect = (effectCb: EffectCallback) => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useEffect(effectCb, []);
};

export default useOneTimeEffect;
