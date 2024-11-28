import { I18n, moment } from '@ijstech/components';
import { Wallet } from '@ijstech/eth-wallet';

export * from './API';

const formatDate = (date: string | number, customType?: string) => {
  const formatType = customType || 'DD/MM/YYYY';
  return moment(date).format(formatType);
}

const getTimeAgo = (timestamp: string, i18n: I18n) => {
  const currentTime = moment();
  const pastTime = moment(timestamp);
  const duration = moment.duration(currentTime.diff(pastTime));
  if (duration.years() > 0) {
    return i18n.get(duration.years() > 1 ? 'years_ago' : 'year_ago', { value: `${duration.years()}` });
  }
  if (duration.months() > 0) {
    return i18n.get(duration.months() > 1 ? 'months_ago' : 'month_ago', { value: `${duration.months()}` });
  }
  if (duration.days() > 0) {
    return i18n.get(duration.days() > 1 ? 'days_ago' : 'day_ago', { value: `${duration.days()}` });
  }
  if (duration.hours() > 0) {
    return i18n.get(duration.hours() > 1 ? 'hours_ago' : 'hour_ago', { value: `${duration.hours()}` });
  }
  if (duration.minutes() > 0) {
    return i18n.get(duration.minutes() > 1 ? 'minutes_ago' : 'minute_ago', { value: `${duration.minutes()}` });
  }
  return i18n.get('just_now');
}

const getExplorerTxUrl = (txHash: string, chainId?: number) => {
  const wallet = Wallet.getInstance() as Wallet;
  let url = "";
  if (!chainId) {
    chainId = wallet.chainId;
  }
  const networkInfo = wallet.getNetworkInfo(chainId);
  if (networkInfo.blockExplorerUrls && networkInfo.blockExplorerUrls.length) {
    const explorerUrl = networkInfo.blockExplorerUrls[0];
    url = explorerUrl ? `${explorerUrl}${explorerUrl.endsWith("/") ? "" : "/"}tx/${txHash}` : "";
  }
  return url;
}

const parseContractError = (message: string) => {
  if (message.includes('Internal JSON-RPC error.')) {
    message = JSON.parse(message.replace('Internal JSON-RPC error.\n', '')).message;
  }
  const prefixes: string[] = ['MetaMask Tx Signature: ', 'execution reverted: '];
  for (const prefix of prefixes) {
    if (message.startsWith(prefix)) {
      message = message.substring(prefix.length);
      break;
    }
  }
  return message;
}

const compareVersions = (firstVer: string, secondVer: string) => {
  const ver1 = firstVer.split('.').map((v: string) => Number(v));
  const ver2 = secondVer.split('.').map((v: string) => Number(v));
  if (ver1[0] < ver2[0]) {
    return false;
  }
  if (ver1[0] === ver2[0] && ver1[1] < ver2[1]) {
    return false;
  }
  if (ver1[0] == ver2[0] && ver1[1] == ver2[1] && ver1[2] < ver2[2]) {
    return false;
  }
  return true;
}

export {
  formatDate,
  getTimeAgo,
  getExplorerTxUrl,
  parseContractError,
  compareVersions
};