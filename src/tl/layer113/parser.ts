/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable quote-props */
/* eslint-disable spaced-comment */
/* eslint-disable max-len */
/* eslint-disable operator-linebreak */
/* eslint-disable semi-style */

/*******************************************************************************************/
/* This file was automatically generated (https://github.com/misupov/tg-schema-generator). */
/*                                                                                         */
/* Do not make changes to this file unless you know what you are doing -- modify           */
/* the tool instead.                                                                       */
/*                                                                                         */
/* Source: layer113.json (md5: 0bbcf8765e5d19b4f974edcde0a90b89)                           */
/* Time: Thursday, 07 May 2020 06:31:44 (UTC)                                              */
/*                                                                                         */
/*******************************************************************************************/

interface Reader {
  int32(): number;
  long(): string;
  int128(): Uint32Array;
  int256(): Uint32Array;
  double(): number;
  string(): string;
  bytes(): ArrayBuffer;
  rollback(): void;
}

let r: Reader;
let fallbackParse: ((stream: Reader) => any) | undefined;

export default function parse(reader: Reader, fallback?: (stream: Reader) => any) {
  r = reader;
  fallbackParse = fallback;
  return obj();
}

const _boolFalse = () => false;
const _boolTrue = () => true;
const _true = () => true;
const _vector: any = () => ({ _: 'vector' });
const _error: any = () => ({ _: 'error', code: i32(), text: str() });
const _null = () => null;
const _inputPeerEmpty: any = () => ({ _: 'inputPeerEmpty' });
const _inputPeerSelf: any = () => ({ _: 'inputPeerSelf' });
const _inputPeerChat: any = () => ({ _: 'inputPeerChat', chat_id: i32() });
const _inputPeerUser: any = () => ({ _: 'inputPeerUser', user_id: i32(), access_hash: i64() });
const _inputPeerChannel: any = () => ({ _: 'inputPeerChannel', channel_id: i32(), access_hash: i64() });
const _inputPeerUserFromMessage: any = () => ({ _: 'inputPeerUserFromMessage', peer: obj(), msg_id: i32(), user_id: i32() });
const _inputPeerChannelFromMessage: any = () => ({ _: 'inputPeerChannelFromMessage', peer: obj(), msg_id: i32(), channel_id: i32() });
const _inputUserEmpty: any = () => ({ _: 'inputUserEmpty' });
const _inputUserSelf: any = () => ({ _: 'inputUserSelf' });
const _inputUser: any = () => ({ _: 'inputUser', user_id: i32(), access_hash: i64() });
const _inputUserFromMessage: any = () => ({ _: 'inputUserFromMessage', peer: obj(), msg_id: i32(), user_id: i32() });
const _inputPhoneContact: any = () => ({ _: 'inputPhoneContact', client_id: i64(), phone: str(), first_name: str(), last_name: str() });
const _inputFile: any = () => ({ _: 'inputFile', id: i64(), parts: i32(), name: str(), md5_checksum: str() });
const _inputFileBig: any = () => ({ _: 'inputFileBig', id: i64(), parts: i32(), name: str() });
const _inputMediaEmpty: any = () => ({ _: 'inputMediaEmpty' });
const _inputMediaUploadedPhoto = (): any => {
  const result: Record<string, unknown> = { _: 'inputMediaUploadedPhoto' };
  const flags = i32();
  result.file = obj();
  if (flags & 0x1) result.stickers = vector(obj);
  if (flags & 0x2) result.ttl_seconds = i32();
  return result;
};
const _inputMediaPhoto = (): any => {
  const result: Record<string, unknown> = { _: 'inputMediaPhoto' };
  const flags = i32();
  result.id = obj();
  if (flags & 0x1) result.ttl_seconds = i32();
  return result;
};
const _inputMediaGeoPoint: any = () => ({ _: 'inputMediaGeoPoint', geo_point: obj() });
const _inputMediaContact: any = () => ({ _: 'inputMediaContact', phone_number: str(), first_name: str(), last_name: str(), vcard: str() });
const _inputMediaUploadedDocument = (): any => {
  const result: Record<string, unknown> = { _: 'inputMediaUploadedDocument' };
  const flags = i32();
  result.nosound_video = !!(flags & 0x8);
  result.file = obj();
  if (flags & 0x4) result.thumb = obj();
  result.mime_type = str();
  result.attributes = vector(obj);
  if (flags & 0x1) result.stickers = vector(obj);
  if (flags & 0x2) result.ttl_seconds = i32();
  return result;
};
const _inputMediaDocument = (): any => {
  const result: Record<string, unknown> = { _: 'inputMediaDocument' };
  const flags = i32();
  result.id = obj();
  if (flags & 0x1) result.ttl_seconds = i32();
  return result;
};
const _inputMediaVenue: any = () => ({ _: 'inputMediaVenue', geo_point: obj(), title: str(), address: str(), provider: str(), venue_id: str(), venue_type: str() });
const _inputMediaGifExternal: any = () => ({ _: 'inputMediaGifExternal', url: str(), q: str() });
const _inputMediaPhotoExternal = (): any => {
  const result: Record<string, unknown> = { _: 'inputMediaPhotoExternal' };
  const flags = i32();
  result.url = str();
  if (flags & 0x1) result.ttl_seconds = i32();
  return result;
};
const _inputMediaDocumentExternal = (): any => {
  const result: Record<string, unknown> = { _: 'inputMediaDocumentExternal' };
  const flags = i32();
  result.url = str();
  if (flags & 0x1) result.ttl_seconds = i32();
  return result;
};
const _inputMediaGame: any = () => ({ _: 'inputMediaGame', id: obj() });
const _inputMediaInvoice = (): any => {
  const result: Record<string, unknown> = { _: 'inputMediaInvoice' };
  const flags = i32();
  result.title = str();
  result.description = str();
  if (flags & 0x1) result.photo = obj();
  result.invoice = obj();
  result.payload = bytes();
  result.provider = str();
  result.provider_data = obj();
  result.start_param = str();
  return result;
};
const _inputMediaGeoLive = (): any => {
  const result: Record<string, unknown> = { _: 'inputMediaGeoLive' };
  const flags = i32();
  result.stopped = !!(flags & 0x1);
  result.geo_point = obj();
  if (flags & 0x2) result.period = i32();
  return result;
};
const _inputMediaPoll = (): any => {
  const result: Record<string, unknown> = { _: 'inputMediaPoll' };
  const flags = i32();
  result.poll = obj();
  if (flags & 0x1) result.correct_answers = vector(bytes);
  if (flags & 0x2) result.solution = str();
  if (flags & 0x2) result.solution_entities = vector(obj);
  return result;
};
const _inputMediaDice: any = () => ({ _: 'inputMediaDice', emoticon: str() });
const _inputChatPhotoEmpty: any = () => ({ _: 'inputChatPhotoEmpty' });
const _inputChatUploadedPhoto: any = () => ({ _: 'inputChatUploadedPhoto', file: obj() });
const _inputChatPhoto: any = () => ({ _: 'inputChatPhoto', id: obj() });
const _inputGeoPointEmpty: any = () => ({ _: 'inputGeoPointEmpty' });
const _inputGeoPoint: any = () => ({ _: 'inputGeoPoint', lat: f64(), long: f64() });
const _inputPhotoEmpty: any = () => ({ _: 'inputPhotoEmpty' });
const _inputPhoto: any = () => ({ _: 'inputPhoto', id: i64(), access_hash: i64(), file_reference: bytes() });
const _inputFileLocation: any = () => ({ _: 'inputFileLocation', volume_id: i64(), local_id: i32(), secret: i64(), file_reference: bytes() });
const _inputEncryptedFileLocation: any = () => ({ _: 'inputEncryptedFileLocation', id: i64(), access_hash: i64() });
const _inputDocumentFileLocation: any = () => ({ _: 'inputDocumentFileLocation', id: i64(), access_hash: i64(), file_reference: bytes(), thumb_size: str() });
const _inputSecureFileLocation: any = () => ({ _: 'inputSecureFileLocation', id: i64(), access_hash: i64() });
const _inputTakeoutFileLocation: any = () => ({ _: 'inputTakeoutFileLocation' });
const _inputPhotoFileLocation: any = () => ({ _: 'inputPhotoFileLocation', id: i64(), access_hash: i64(), file_reference: bytes(), thumb_size: str() });
const _inputPhotoLegacyFileLocation: any = () => ({ _: 'inputPhotoLegacyFileLocation', id: i64(), access_hash: i64(), file_reference: bytes(), volume_id: i64(), local_id: i32(), secret: i64() });
const _inputPeerPhotoFileLocation = (): any => {
  const result: Record<string, unknown> = { _: 'inputPeerPhotoFileLocation' };
  const flags = i32();
  result.big = !!(flags & 0x1);
  result.peer = obj();
  result.volume_id = i64();
  result.local_id = i32();
  return result;
};
const _inputStickerSetThumb: any = () => ({ _: 'inputStickerSetThumb', stickerset: obj(), volume_id: i64(), local_id: i32() });
const _peerUser: any = () => ({ _: 'peerUser', user_id: i32() });
const _peerChat: any = () => ({ _: 'peerChat', chat_id: i32() });
const _peerChannel: any = () => ({ _: 'peerChannel', channel_id: i32() });
const _storageFileUnknown: any = () => ({ _: 'storage.fileUnknown' });
const _storageFilePartial: any = () => ({ _: 'storage.filePartial' });
const _storageFileJpeg: any = () => ({ _: 'storage.fileJpeg' });
const _storageFileGif: any = () => ({ _: 'storage.fileGif' });
const _storageFilePng: any = () => ({ _: 'storage.filePng' });
const _storageFilePdf: any = () => ({ _: 'storage.filePdf' });
const _storageFileMp3: any = () => ({ _: 'storage.fileMp3' });
const _storageFileMov: any = () => ({ _: 'storage.fileMov' });
const _storageFileMp4: any = () => ({ _: 'storage.fileMp4' });
const _storageFileWebp: any = () => ({ _: 'storage.fileWebp' });
const _userEmpty: any = () => ({ _: 'userEmpty', id: i32() });
const _user = (): any => {
  const result: Record<string, unknown> = { _: 'user' };
  const flags = i32();
  result.self = !!(flags & 0x400);
  result.contact = !!(flags & 0x800);
  result.mutual_contact = !!(flags & 0x1000);
  result.deleted = !!(flags & 0x2000);
  result.bot = !!(flags & 0x4000);
  result.bot_chat_history = !!(flags & 0x8000);
  result.bot_nochats = !!(flags & 0x10000);
  result.verified = !!(flags & 0x20000);
  result.restricted = !!(flags & 0x40000);
  result.min = !!(flags & 0x100000);
  result.bot_inline_geo = !!(flags & 0x200000);
  result.support = !!(flags & 0x800000);
  result.scam = !!(flags & 0x1000000);
  result.id = i32();
  if (flags & 0x1) result.access_hash = i64();
  if (flags & 0x2) result.first_name = str();
  if (flags & 0x4) result.last_name = str();
  if (flags & 0x8) result.username = str();
  if (flags & 0x10) result.phone = str();
  if (flags & 0x20) result.photo = obj();
  if (flags & 0x40) result.status = obj();
  if (flags & 0x4000) result.bot_info_version = i32();
  if (flags & 0x40000) result.restriction_reason = vector(obj);
  if (flags & 0x80000) result.bot_inline_placeholder = str();
  if (flags & 0x400000) result.lang_code = str();
  return result;
};
const _userProfilePhotoEmpty: any = () => ({ _: 'userProfilePhotoEmpty' });
const _userProfilePhoto: any = () => ({ _: 'userProfilePhoto', photo_id: i64(), photo_small: obj(), photo_big: obj(), dc_id: i32() });
const _userStatusEmpty: any = () => ({ _: 'userStatusEmpty' });
const _userStatusOnline: any = () => ({ _: 'userStatusOnline', expires: i32() });
const _userStatusOffline: any = () => ({ _: 'userStatusOffline', was_online: i32() });
const _userStatusRecently: any = () => ({ _: 'userStatusRecently' });
const _userStatusLastWeek: any = () => ({ _: 'userStatusLastWeek' });
const _userStatusLastMonth: any = () => ({ _: 'userStatusLastMonth' });
const _chatEmpty: any = () => ({ _: 'chatEmpty', id: i32() });
const _chat = (): any => {
  const result: Record<string, unknown> = { _: 'chat' };
  const flags = i32();
  result.creator = !!(flags & 0x1);
  result.kicked = !!(flags & 0x2);
  result.left = !!(flags & 0x4);
  result.deactivated = !!(flags & 0x20);
  result.id = i32();
  result.title = str();
  result.photo = obj();
  result.participants_count = i32();
  result.date = i32();
  result.version = i32();
  if (flags & 0x40) result.migrated_to = obj();
  if (flags & 0x4000) result.admin_rights = obj();
  if (flags & 0x40000) result.default_banned_rights = obj();
  return result;
};
const _chatForbidden: any = () => ({ _: 'chatForbidden', id: i32(), title: str() });
const _channel = (): any => {
  const result: Record<string, unknown> = { _: 'channel' };
  const flags = i32();
  result.creator = !!(flags & 0x1);
  result.left = !!(flags & 0x4);
  result.broadcast = !!(flags & 0x20);
  result.verified = !!(flags & 0x80);
  result.megagroup = !!(flags & 0x100);
  result.restricted = !!(flags & 0x200);
  result.signatures = !!(flags & 0x800);
  result.min = !!(flags & 0x1000);
  result.scam = !!(flags & 0x80000);
  result.has_link = !!(flags & 0x100000);
  result.has_geo = !!(flags & 0x200000);
  result.slowmode_enabled = !!(flags & 0x400000);
  result.id = i32();
  if (flags & 0x2000) result.access_hash = i64();
  result.title = str();
  if (flags & 0x40) result.username = str();
  result.photo = obj();
  result.date = i32();
  result.version = i32();
  if (flags & 0x200) result.restriction_reason = vector(obj);
  if (flags & 0x4000) result.admin_rights = obj();
  if (flags & 0x8000) result.banned_rights = obj();
  if (flags & 0x40000) result.default_banned_rights = obj();
  if (flags & 0x20000) result.participants_count = i32();
  return result;
};
const _channelForbidden = (): any => {
  const result: Record<string, unknown> = { _: 'channelForbidden' };
  const flags = i32();
  result.broadcast = !!(flags & 0x20);
  result.megagroup = !!(flags & 0x100);
  result.id = i32();
  result.access_hash = i64();
  result.title = str();
  if (flags & 0x10000) result.until_date = i32();
  return result;
};
const _chatFull = (): any => {
  const result: Record<string, unknown> = { _: 'chatFull' };
  const flags = i32();
  result.can_set_username = !!(flags & 0x80);
  result.has_scheduled = !!(flags & 0x100);
  result.id = i32();
  result.about = str();
  result.participants = obj();
  if (flags & 0x4) result.chat_photo = obj();
  result.notify_settings = obj();
  result.exported_invite = obj();
  if (flags & 0x8) result.bot_info = vector(obj);
  if (flags & 0x40) result.pinned_msg_id = i32();
  if (flags & 0x800) result.folder_id = i32();
  return result;
};
const _channelFull = (): any => {
  const result: Record<string, unknown> = { _: 'channelFull' };
  const flags = i32();
  result.can_view_participants = !!(flags & 0x8);
  result.can_set_username = !!(flags & 0x40);
  result.can_set_stickers = !!(flags & 0x80);
  result.hidden_prehistory = !!(flags & 0x400);
  result.can_view_stats = !!(flags & 0x1000);
  result.can_set_location = !!(flags & 0x10000);
  result.has_scheduled = !!(flags & 0x80000);
  result.id = i32();
  result.about = str();
  if (flags & 0x1) result.participants_count = i32();
  if (flags & 0x2) result.admins_count = i32();
  if (flags & 0x4) result.kicked_count = i32();
  if (flags & 0x4) result.banned_count = i32();
  if (flags & 0x2000) result.online_count = i32();
  result.read_inbox_max_id = i32();
  result.read_outbox_max_id = i32();
  result.unread_count = i32();
  result.chat_photo = obj();
  result.notify_settings = obj();
  result.exported_invite = obj();
  result.bot_info = vector(obj);
  if (flags & 0x10) result.migrated_from_chat_id = i32();
  if (flags & 0x10) result.migrated_from_max_id = i32();
  if (flags & 0x20) result.pinned_msg_id = i32();
  if (flags & 0x100) result.stickerset = obj();
  if (flags & 0x200) result.available_min_id = i32();
  if (flags & 0x800) result.folder_id = i32();
  if (flags & 0x4000) result.linked_chat_id = i32();
  if (flags & 0x8000) result.location = obj();
  if (flags & 0x20000) result.slowmode_seconds = i32();
  if (flags & 0x40000) result.slowmode_next_send_date = i32();
  if (flags & 0x1000) result.stats_dc = i32();
  result.pts = i32();
  return result;
};
const _chatParticipant: any = () => ({ _: 'chatParticipant', user_id: i32(), inviter_id: i32(), date: i32() });
const _chatParticipantCreator: any = () => ({ _: 'chatParticipantCreator', user_id: i32() });
const _chatParticipantAdmin: any = () => ({ _: 'chatParticipantAdmin', user_id: i32(), inviter_id: i32(), date: i32() });
const _chatParticipantsForbidden = (): any => {
  const result: Record<string, unknown> = { _: 'chatParticipantsForbidden' };
  const flags = i32();
  result.chat_id = i32();
  if (flags & 0x1) result.self_participant = obj();
  return result;
};
const _chatParticipants: any = () => ({ _: 'chatParticipants', chat_id: i32(), participants: vector(obj), version: i32() });
const _chatPhotoEmpty: any = () => ({ _: 'chatPhotoEmpty' });
const _chatPhoto: any = () => ({ _: 'chatPhoto', photo_small: obj(), photo_big: obj(), dc_id: i32() });
const _messageEmpty: any = () => ({ _: 'messageEmpty', id: i32() });
const _message = (): any => {
  const result: Record<string, unknown> = { _: 'message' };
  const flags = i32();
  result.out = !!(flags & 0x2);
  result.mentioned = !!(flags & 0x10);
  result.media_unread = !!(flags & 0x20);
  result.silent = !!(flags & 0x2000);
  result.post = !!(flags & 0x4000);
  result.from_scheduled = !!(flags & 0x40000);
  result.legacy = !!(flags & 0x80000);
  result.edit_hide = !!(flags & 0x200000);
  result.id = i32();
  if (flags & 0x100) result.from_id = i32();
  result.to_id = obj();
  if (flags & 0x4) result.fwd_from = obj();
  if (flags & 0x800) result.via_bot_id = i32();
  if (flags & 0x8) result.reply_to_msg_id = i32();
  result.date = i32();
  result.message = str();
  if (flags & 0x200) result.media = obj();
  if (flags & 0x40) result.reply_markup = obj();
  if (flags & 0x80) result.entities = vector(obj);
  if (flags & 0x400) result.views = i32();
  if (flags & 0x8000) result.edit_date = i32();
  if (flags & 0x10000) result.post_author = str();
  if (flags & 0x20000) result.grouped_id = i64();
  if (flags & 0x400000) result.restriction_reason = vector(obj);
  return result;
};
const _messageService = (): any => {
  const result: Record<string, unknown> = { _: 'messageService' };
  const flags = i32();
  result.out = !!(flags & 0x2);
  result.mentioned = !!(flags & 0x10);
  result.media_unread = !!(flags & 0x20);
  result.silent = !!(flags & 0x2000);
  result.post = !!(flags & 0x4000);
  result.legacy = !!(flags & 0x80000);
  result.id = i32();
  if (flags & 0x100) result.from_id = i32();
  result.to_id = obj();
  if (flags & 0x8) result.reply_to_msg_id = i32();
  result.date = i32();
  result.action = obj();
  return result;
};
const _messageMediaEmpty: any = () => ({ _: 'messageMediaEmpty' });
const _messageMediaPhoto = (): any => {
  const result: Record<string, unknown> = { _: 'messageMediaPhoto' };
  const flags = i32();
  if (flags & 0x1) result.photo = obj();
  if (flags & 0x4) result.ttl_seconds = i32();
  return result;
};
const _messageMediaGeo: any = () => ({ _: 'messageMediaGeo', geo: obj() });
const _messageMediaContact: any = () => ({ _: 'messageMediaContact', phone_number: str(), first_name: str(), last_name: str(), vcard: str(), user_id: i32() });
const _messageMediaUnsupported: any = () => ({ _: 'messageMediaUnsupported' });
const _messageMediaDocument = (): any => {
  const result: Record<string, unknown> = { _: 'messageMediaDocument' };
  const flags = i32();
  if (flags & 0x1) result.document = obj();
  if (flags & 0x4) result.ttl_seconds = i32();
  return result;
};
const _messageMediaWebPage: any = () => ({ _: 'messageMediaWebPage', webpage: obj() });
const _messageMediaVenue: any = () => ({ _: 'messageMediaVenue', geo: obj(), title: str(), address: str(), provider: str(), venue_id: str(), venue_type: str() });
const _messageMediaGame: any = () => ({ _: 'messageMediaGame', game: obj() });
const _messageMediaInvoice = (): any => {
  const result: Record<string, unknown> = { _: 'messageMediaInvoice' };
  const flags = i32();
  result.shipping_address_requested = !!(flags & 0x2);
  result.test = !!(flags & 0x8);
  result.title = str();
  result.description = str();
  if (flags & 0x1) result.photo = obj();
  if (flags & 0x4) result.receipt_msg_id = i32();
  result.currency = str();
  result.total_amount = i64();
  result.start_param = str();
  return result;
};
const _messageMediaGeoLive: any = () => ({ _: 'messageMediaGeoLive', geo: obj(), period: i32() });
const _messageMediaPoll: any = () => ({ _: 'messageMediaPoll', poll: obj(), results: obj() });
const _messageMediaDice: any = () => ({ _: 'messageMediaDice', value: i32(), emoticon: str() });
const _messageActionEmpty: any = () => ({ _: 'messageActionEmpty' });
const _messageActionChatCreate: any = () => ({ _: 'messageActionChatCreate', title: str(), users: vector(i32) });
const _messageActionChatEditTitle: any = () => ({ _: 'messageActionChatEditTitle', title: str() });
const _messageActionChatEditPhoto: any = () => ({ _: 'messageActionChatEditPhoto', photo: obj() });
const _messageActionChatDeletePhoto: any = () => ({ _: 'messageActionChatDeletePhoto' });
const _messageActionChatAddUser: any = () => ({ _: 'messageActionChatAddUser', users: vector(i32) });
const _messageActionChatDeleteUser: any = () => ({ _: 'messageActionChatDeleteUser', user_id: i32() });
const _messageActionChatJoinedByLink: any = () => ({ _: 'messageActionChatJoinedByLink', inviter_id: i32() });
const _messageActionChannelCreate: any = () => ({ _: 'messageActionChannelCreate', title: str() });
const _messageActionChatMigrateTo: any = () => ({ _: 'messageActionChatMigrateTo', channel_id: i32() });
const _messageActionChannelMigrateFrom: any = () => ({ _: 'messageActionChannelMigrateFrom', title: str(), chat_id: i32() });
const _messageActionPinMessage: any = () => ({ _: 'messageActionPinMessage' });
const _messageActionHistoryClear: any = () => ({ _: 'messageActionHistoryClear' });
const _messageActionGameScore: any = () => ({ _: 'messageActionGameScore', game_id: i64(), score: i32() });
const _messageActionPaymentSentMe = (): any => {
  const result: Record<string, unknown> = { _: 'messageActionPaymentSentMe' };
  const flags = i32();
  result.currency = str();
  result.total_amount = i64();
  result.payload = bytes();
  if (flags & 0x1) result.info = obj();
  if (flags & 0x2) result.shipping_option_id = str();
  result.charge = obj();
  return result;
};
const _messageActionPaymentSent: any = () => ({ _: 'messageActionPaymentSent', currency: str(), total_amount: i64() });
const _messageActionPhoneCall = (): any => {
  const result: Record<string, unknown> = { _: 'messageActionPhoneCall' };
  const flags = i32();
  result.video = !!(flags & 0x4);
  result.call_id = i64();
  if (flags & 0x1) result.reason = obj();
  if (flags & 0x2) result.duration = i32();
  return result;
};
const _messageActionScreenshotTaken: any = () => ({ _: 'messageActionScreenshotTaken' });
const _messageActionCustomAction: any = () => ({ _: 'messageActionCustomAction', message: str() });
const _messageActionBotAllowed: any = () => ({ _: 'messageActionBotAllowed', domain: str() });
const _messageActionSecureValuesSentMe: any = () => ({ _: 'messageActionSecureValuesSentMe', values: vector(obj), credentials: obj() });
const _messageActionSecureValuesSent: any = () => ({ _: 'messageActionSecureValuesSent', types: vector(obj) });
const _messageActionContactSignUp: any = () => ({ _: 'messageActionContactSignUp' });
const _dialog = (): any => {
  const result: Record<string, unknown> = { _: 'dialog' };
  const flags = i32();
  result.pinned = !!(flags & 0x4);
  result.unread_mark = !!(flags & 0x8);
  result.peer = obj();
  result.top_message = i32();
  result.read_inbox_max_id = i32();
  result.read_outbox_max_id = i32();
  result.unread_count = i32();
  result.unread_mentions_count = i32();
  result.notify_settings = obj();
  if (flags & 0x1) result.pts = i32();
  if (flags & 0x2) result.draft = obj();
  if (flags & 0x10) result.folder_id = i32();
  return result;
};
const _dialogFolder = (): any => {
  const result: Record<string, unknown> = { _: 'dialogFolder' };
  const flags = i32();
  result.pinned = !!(flags & 0x4);
  result.folder = obj();
  result.peer = obj();
  result.top_message = i32();
  result.unread_muted_peers_count = i32();
  result.unread_unmuted_peers_count = i32();
  result.unread_muted_messages_count = i32();
  result.unread_unmuted_messages_count = i32();
  return result;
};
const _photoEmpty: any = () => ({ _: 'photoEmpty', id: i64() });
const _photo = (): any => {
  const result: Record<string, unknown> = { _: 'photo' };
  const flags = i32();
  result.has_stickers = !!(flags & 0x1);
  result.id = i64();
  result.access_hash = i64();
  result.file_reference = bytes();
  result.date = i32();
  result.sizes = vector(obj);
  result.dc_id = i32();
  return result;
};
const _photoSizeEmpty: any = () => ({ _: 'photoSizeEmpty', type: str() });
const _photoSize: any = () => ({ _: 'photoSize', type: str(), location: obj(), w: i32(), h: i32(), size: i32() });
const _photoCachedSize: any = () => ({ _: 'photoCachedSize', type: str(), location: obj(), w: i32(), h: i32(), bytes: bytes() });
const _photoStrippedSize: any = () => ({ _: 'photoStrippedSize', type: str(), bytes: bytes() });
const _geoPointEmpty: any = () => ({ _: 'geoPointEmpty' });
const _geoPoint: any = () => ({ _: 'geoPoint', long: f64(), lat: f64(), access_hash: i64() });
const _authSentCode = (): any => {
  const result: Record<string, unknown> = { _: 'auth.sentCode' };
  const flags = i32();
  result.type = obj();
  result.phone_code_hash = str();
  if (flags & 0x2) result.next_type = obj();
  if (flags & 0x4) result.timeout = i32();
  return result;
};
const _authAuthorization = (): any => {
  const result: Record<string, unknown> = { _: 'auth.authorization' };
  const flags = i32();
  if (flags & 0x1) result.tmp_sessions = i32();
  result.user = obj();
  return result;
};
const _authAuthorizationSignUpRequired = (): any => {
  const result: Record<string, unknown> = { _: 'auth.authorizationSignUpRequired' };
  const flags = i32();
  if (flags & 0x1) result.terms_of_service = obj();
  return result;
};
const _authExportedAuthorization: any = () => ({ _: 'auth.exportedAuthorization', id: i32(), bytes: bytes() });
const _inputNotifyPeer: any = () => ({ _: 'inputNotifyPeer', peer: obj() });
const _inputNotifyUsers: any = () => ({ _: 'inputNotifyUsers' });
const _inputNotifyChats: any = () => ({ _: 'inputNotifyChats' });
const _inputNotifyBroadcasts: any = () => ({ _: 'inputNotifyBroadcasts' });
const _inputPeerNotifySettings = (): any => {
  const result: Record<string, unknown> = { _: 'inputPeerNotifySettings' };
  const flags = i32();
  if (flags & 0x1) result.show_previews = obj();
  if (flags & 0x2) result.silent = obj();
  if (flags & 0x4) result.mute_until = i32();
  if (flags & 0x8) result.sound = str();
  return result;
};
const _peerNotifySettings = (): any => {
  const result: Record<string, unknown> = { _: 'peerNotifySettings' };
  const flags = i32();
  if (flags & 0x1) result.show_previews = obj();
  if (flags & 0x2) result.silent = obj();
  if (flags & 0x4) result.mute_until = i32();
  if (flags & 0x8) result.sound = str();
  return result;
};
const _peerSettings = (): any => {
  const result: Record<string, unknown> = { _: 'peerSettings' };
  const flags = i32();
  result.report_spam = !!(flags & 0x1);
  result.add_contact = !!(flags & 0x2);
  result.block_contact = !!(flags & 0x4);
  result.share_contact = !!(flags & 0x8);
  result.need_contacts_exception = !!(flags & 0x10);
  result.report_geo = !!(flags & 0x20);
  return result;
};
const _wallPaper = (): any => {
  const result: Record<string, unknown> = { _: 'wallPaper' };
  result.id = i64();
  const flags = i32();
  result.creator = !!(flags & 0x1);
  result.default = !!(flags & 0x2);
  result.pattern = !!(flags & 0x8);
  result.dark = !!(flags & 0x10);
  result.access_hash = i64();
  result.slug = str();
  result.document = obj();
  if (flags & 0x4) result.settings = obj();
  return result;
};
const _wallPaperNoFile = (): any => {
  const result: Record<string, unknown> = { _: 'wallPaperNoFile' };
  const flags = i32();
  result.default = !!(flags & 0x2);
  result.dark = !!(flags & 0x10);
  if (flags & 0x4) result.settings = obj();
  return result;
};
const _inputReportReasonSpam: any = () => ({ _: 'inputReportReasonSpam' });
const _inputReportReasonViolence: any = () => ({ _: 'inputReportReasonViolence' });
const _inputReportReasonPornography: any = () => ({ _: 'inputReportReasonPornography' });
const _inputReportReasonChildAbuse: any = () => ({ _: 'inputReportReasonChildAbuse' });
const _inputReportReasonOther: any = () => ({ _: 'inputReportReasonOther', text: str() });
const _inputReportReasonCopyright: any = () => ({ _: 'inputReportReasonCopyright' });
const _inputReportReasonGeoIrrelevant: any = () => ({ _: 'inputReportReasonGeoIrrelevant' });
const _userFull = (): any => {
  const result: Record<string, unknown> = { _: 'userFull' };
  const flags = i32();
  result.blocked = !!(flags & 0x1);
  result.phone_calls_available = !!(flags & 0x10);
  result.phone_calls_private = !!(flags & 0x20);
  result.can_pin_message = !!(flags & 0x80);
  result.has_scheduled = !!(flags & 0x1000);
  result.user = obj();
  if (flags & 0x2) result.about = str();
  result.settings = obj();
  if (flags & 0x4) result.profile_photo = obj();
  result.notify_settings = obj();
  if (flags & 0x8) result.bot_info = obj();
  if (flags & 0x40) result.pinned_msg_id = i32();
  result.common_chats_count = i32();
  if (flags & 0x800) result.folder_id = i32();
  return result;
};
const _contact: any = () => ({ _: 'contact', user_id: i32(), mutual: obj() });
const _importedContact: any = () => ({ _: 'importedContact', user_id: i32(), client_id: i64() });
const _contactBlocked: any = () => ({ _: 'contactBlocked', user_id: i32(), date: i32() });
const _contactStatus: any = () => ({ _: 'contactStatus', user_id: i32(), status: obj() });
const _contactsContactsNotModified: any = () => ({ _: 'contacts.contactsNotModified' });
const _contactsContacts: any = () => ({ _: 'contacts.contacts', contacts: vector(obj), saved_count: i32(), users: vector(obj) });
const _contactsImportedContacts: any = () => ({ _: 'contacts.importedContacts', imported: vector(obj), popular_invites: vector(obj), retry_contacts: vector(i64), users: vector(obj) });
const _contactsBlocked: any = () => ({ _: 'contacts.blocked', blocked: vector(obj), users: vector(obj) });
const _contactsBlockedSlice: any = () => ({ _: 'contacts.blockedSlice', count: i32(), blocked: vector(obj), users: vector(obj) });
const _messagesDialogs: any = () => ({ _: 'messages.dialogs', dialogs: vector(obj), messages: vector(obj), chats: vector(obj), users: vector(obj) });
const _messagesDialogsSlice: any = () => ({ _: 'messages.dialogsSlice', count: i32(), dialogs: vector(obj), messages: vector(obj), chats: vector(obj), users: vector(obj) });
const _messagesDialogsNotModified: any = () => ({ _: 'messages.dialogsNotModified', count: i32() });
const _messagesMessages: any = () => ({ _: 'messages.messages', messages: vector(obj), chats: vector(obj), users: vector(obj) });
const _messagesMessagesSlice = (): any => {
  const result: Record<string, unknown> = { _: 'messages.messagesSlice' };
  const flags = i32();
  result.inexact = !!(flags & 0x2);
  result.count = i32();
  if (flags & 0x1) result.next_rate = i32();
  result.messages = vector(obj);
  result.chats = vector(obj);
  result.users = vector(obj);
  return result;
};
const _messagesChannelMessages = (): any => {
  const result: Record<string, unknown> = { _: 'messages.channelMessages' };
  const flags = i32();
  result.inexact = !!(flags & 0x2);
  result.pts = i32();
  result.count = i32();
  result.messages = vector(obj);
  result.chats = vector(obj);
  result.users = vector(obj);
  return result;
};
const _messagesMessagesNotModified: any = () => ({ _: 'messages.messagesNotModified', count: i32() });
const _messagesChats: any = () => ({ _: 'messages.chats', chats: vector(obj) });
const _messagesChatsSlice: any = () => ({ _: 'messages.chatsSlice', count: i32(), chats: vector(obj) });
const _messagesChatFull: any = () => ({ _: 'messages.chatFull', full_chat: obj(), chats: vector(obj), users: vector(obj) });
const _messagesAffectedHistory: any = () => ({ _: 'messages.affectedHistory', pts: i32(), pts_count: i32(), offset: i32() });
const _inputMessagesFilterEmpty: any = () => ({ _: 'inputMessagesFilterEmpty' });
const _inputMessagesFilterPhotos: any = () => ({ _: 'inputMessagesFilterPhotos' });
const _inputMessagesFilterVideo: any = () => ({ _: 'inputMessagesFilterVideo' });
const _inputMessagesFilterPhotoVideo: any = () => ({ _: 'inputMessagesFilterPhotoVideo' });
const _inputMessagesFilterDocument: any = () => ({ _: 'inputMessagesFilterDocument' });
const _inputMessagesFilterUrl: any = () => ({ _: 'inputMessagesFilterUrl' });
const _inputMessagesFilterGif: any = () => ({ _: 'inputMessagesFilterGif' });
const _inputMessagesFilterVoice: any = () => ({ _: 'inputMessagesFilterVoice' });
const _inputMessagesFilterMusic: any = () => ({ _: 'inputMessagesFilterMusic' });
const _inputMessagesFilterChatPhotos: any = () => ({ _: 'inputMessagesFilterChatPhotos' });
const _inputMessagesFilterPhoneCalls = (): any => {
  const result: Record<string, unknown> = { _: 'inputMessagesFilterPhoneCalls' };
  const flags = i32();
  result.missed = !!(flags & 0x1);
  return result;
};
const _inputMessagesFilterRoundVoice: any = () => ({ _: 'inputMessagesFilterRoundVoice' });
const _inputMessagesFilterRoundVideo: any = () => ({ _: 'inputMessagesFilterRoundVideo' });
const _inputMessagesFilterMyMentions: any = () => ({ _: 'inputMessagesFilterMyMentions' });
const _inputMessagesFilterGeo: any = () => ({ _: 'inputMessagesFilterGeo' });
const _inputMessagesFilterContacts: any = () => ({ _: 'inputMessagesFilterContacts' });
const _updateNewMessage: any = () => ({ _: 'updateNewMessage', _update: true, message: obj(), pts: i32(), pts_count: i32() });
const _updateMessageID: any = () => ({ _: 'updateMessageID', _update: true, id: i32(), random_id: i64() });
const _updateDeleteMessages: any = () => ({ _: 'updateDeleteMessages', _update: true, messages: vector(i32), pts: i32(), pts_count: i32() });
const _updateUserTyping: any = () => ({ _: 'updateUserTyping', _update: true, user_id: i32(), action: obj() });
const _updateChatUserTyping: any = () => ({ _: 'updateChatUserTyping', _update: true, chat_id: i32(), user_id: i32(), action: obj() });
const _updateChatParticipants: any = () => ({ _: 'updateChatParticipants', _update: true, participants: obj() });
const _updateUserStatus: any = () => ({ _: 'updateUserStatus', _update: true, user_id: i32(), status: obj() });
const _updateUserName: any = () => ({ _: 'updateUserName', _update: true, user_id: i32(), first_name: str(), last_name: str(), username: str() });
const _updateUserPhoto: any = () => ({ _: 'updateUserPhoto', _update: true, user_id: i32(), date: i32(), photo: obj(), previous: obj() });
const _updateNewEncryptedMessage: any = () => ({ _: 'updateNewEncryptedMessage', _update: true, message: obj(), qts: i32() });
const _updateEncryptedChatTyping: any = () => ({ _: 'updateEncryptedChatTyping', _update: true, chat_id: i32() });
const _updateEncryption: any = () => ({ _: 'updateEncryption', _update: true, chat: obj(), date: i32() });
const _updateEncryptedMessagesRead: any = () => ({ _: 'updateEncryptedMessagesRead', _update: true, chat_id: i32(), max_date: i32(), date: i32() });
const _updateChatParticipantAdd: any = () => ({ _: 'updateChatParticipantAdd', _update: true, chat_id: i32(), user_id: i32(), inviter_id: i32(), date: i32(), version: i32() });
const _updateChatParticipantDelete: any = () => ({ _: 'updateChatParticipantDelete', _update: true, chat_id: i32(), user_id: i32(), version: i32() });
const _updateDcOptions: any = () => ({ _: 'updateDcOptions', _update: true, dc_options: vector(obj) });
const _updateUserBlocked: any = () => ({ _: 'updateUserBlocked', _update: true, user_id: i32(), blocked: obj() });
const _updateNotifySettings: any = () => ({ _: 'updateNotifySettings', _update: true, peer: obj(), notify_settings: obj() });
const _updateServiceNotification = (): any => {
  const result: Record<string, unknown> = { _: 'updateServiceNotification' };
  result._update = true;
  const flags = i32();
  result.popup = !!(flags & 0x1);
  if (flags & 0x2) result.inbox_date = i32();
  result.type = str();
  result.message = str();
  result.media = obj();
  result.entities = vector(obj);
  return result;
};
const _updatePrivacy: any = () => ({ _: 'updatePrivacy', _update: true, key: obj(), rules: vector(obj) });
const _updateUserPhone: any = () => ({ _: 'updateUserPhone', _update: true, user_id: i32(), phone: str() });
const _updateReadHistoryInbox = (): any => {
  const result: Record<string, unknown> = { _: 'updateReadHistoryInbox' };
  result._update = true;
  const flags = i32();
  if (flags & 0x1) result.folder_id = i32();
  result.peer = obj();
  result.max_id = i32();
  result.still_unread_count = i32();
  result.pts = i32();
  result.pts_count = i32();
  return result;
};
const _updateReadHistoryOutbox: any = () => ({ _: 'updateReadHistoryOutbox', _update: true, peer: obj(), max_id: i32(), pts: i32(), pts_count: i32() });
const _updateWebPage: any = () => ({ _: 'updateWebPage', _update: true, webpage: obj(), pts: i32(), pts_count: i32() });
const _updateReadMessagesContents: any = () => ({ _: 'updateReadMessagesContents', _update: true, messages: vector(i32), pts: i32(), pts_count: i32() });
const _updateChannelTooLong = (): any => {
  const result: Record<string, unknown> = { _: 'updateChannelTooLong' };
  result._update = true;
  const flags = i32();
  result.channel_id = i32();
  if (flags & 0x1) result.pts = i32();
  return result;
};
const _updateChannel: any = () => ({ _: 'updateChannel', _update: true, channel_id: i32() });
const _updateNewChannelMessage: any = () => ({ _: 'updateNewChannelMessage', _update: true, message: obj(), pts: i32(), pts_count: i32() });
const _updateReadChannelInbox = (): any => {
  const result: Record<string, unknown> = { _: 'updateReadChannelInbox' };
  result._update = true;
  const flags = i32();
  if (flags & 0x1) result.folder_id = i32();
  result.channel_id = i32();
  result.max_id = i32();
  result.still_unread_count = i32();
  result.pts = i32();
  return result;
};
const _updateDeleteChannelMessages: any = () => ({ _: 'updateDeleteChannelMessages', _update: true, channel_id: i32(), messages: vector(i32), pts: i32(), pts_count: i32() });
const _updateChannelMessageViews: any = () => ({ _: 'updateChannelMessageViews', _update: true, channel_id: i32(), id: i32(), views: i32() });
const _updateChatParticipantAdmin: any = () => ({ _: 'updateChatParticipantAdmin', _update: true, chat_id: i32(), user_id: i32(), is_admin: obj(), version: i32() });
const _updateNewStickerSet: any = () => ({ _: 'updateNewStickerSet', _update: true, stickerset: obj() });
const _updateStickerSetsOrder = (): any => {
  const result: Record<string, unknown> = { _: 'updateStickerSetsOrder' };
  result._update = true;
  const flags = i32();
  result.masks = !!(flags & 0x1);
  result.order = vector(i64);
  return result;
};
const _updateStickerSets: any = () => ({ _: 'updateStickerSets', _update: true });
const _updateSavedGifs: any = () => ({ _: 'updateSavedGifs', _update: true });
const _updateBotInlineQuery = (): any => {
  const result: Record<string, unknown> = { _: 'updateBotInlineQuery' };
  result._update = true;
  const flags = i32();
  result.query_id = i64();
  result.user_id = i32();
  result.query = str();
  if (flags & 0x1) result.geo = obj();
  result.offset = str();
  return result;
};
const _updateBotInlineSend = (): any => {
  const result: Record<string, unknown> = { _: 'updateBotInlineSend' };
  result._update = true;
  const flags = i32();
  result.user_id = i32();
  result.query = str();
  if (flags & 0x1) result.geo = obj();
  result.id = str();
  if (flags & 0x2) result.msg_id = obj();
  return result;
};
const _updateEditChannelMessage: any = () => ({ _: 'updateEditChannelMessage', _update: true, message: obj(), pts: i32(), pts_count: i32() });
const _updateChannelPinnedMessage: any = () => ({ _: 'updateChannelPinnedMessage', _update: true, channel_id: i32(), id: i32() });
const _updateBotCallbackQuery = (): any => {
  const result: Record<string, unknown> = { _: 'updateBotCallbackQuery' };
  result._update = true;
  const flags = i32();
  result.query_id = i64();
  result.user_id = i32();
  result.peer = obj();
  result.msg_id = i32();
  result.chat_instance = i64();
  if (flags & 0x1) result.data = bytes();
  if (flags & 0x2) result.game_short_name = str();
  return result;
};
const _updateEditMessage: any = () => ({ _: 'updateEditMessage', _update: true, message: obj(), pts: i32(), pts_count: i32() });
const _updateInlineBotCallbackQuery = (): any => {
  const result: Record<string, unknown> = { _: 'updateInlineBotCallbackQuery' };
  result._update = true;
  const flags = i32();
  result.query_id = i64();
  result.user_id = i32();
  result.msg_id = obj();
  result.chat_instance = i64();
  if (flags & 0x1) result.data = bytes();
  if (flags & 0x2) result.game_short_name = str();
  return result;
};
const _updateReadChannelOutbox: any = () => ({ _: 'updateReadChannelOutbox', _update: true, channel_id: i32(), max_id: i32() });
const _updateDraftMessage: any = () => ({ _: 'updateDraftMessage', _update: true, peer: obj(), draft: obj() });
const _updateReadFeaturedStickers: any = () => ({ _: 'updateReadFeaturedStickers', _update: true });
const _updateRecentStickers: any = () => ({ _: 'updateRecentStickers', _update: true });
const _updateConfig: any = () => ({ _: 'updateConfig', _update: true });
const _updatePtsChanged: any = () => ({ _: 'updatePtsChanged', _update: true });
const _updateChannelWebPage: any = () => ({ _: 'updateChannelWebPage', _update: true, channel_id: i32(), webpage: obj(), pts: i32(), pts_count: i32() });
const _updateDialogPinned = (): any => {
  const result: Record<string, unknown> = { _: 'updateDialogPinned' };
  result._update = true;
  const flags = i32();
  result.pinned = !!(flags & 0x1);
  if (flags & 0x2) result.folder_id = i32();
  result.peer = obj();
  return result;
};
const _updatePinnedDialogs = (): any => {
  const result: Record<string, unknown> = { _: 'updatePinnedDialogs' };
  result._update = true;
  const flags = i32();
  if (flags & 0x2) result.folder_id = i32();
  if (flags & 0x1) result.order = vector(obj);
  return result;
};
const _updateBotWebhookJSON: any = () => ({ _: 'updateBotWebhookJSON', _update: true, data: obj() });
const _updateBotWebhookJSONQuery: any = () => ({ _: 'updateBotWebhookJSONQuery', _update: true, query_id: i64(), data: obj(), timeout: i32() });
const _updateBotShippingQuery: any = () => ({ _: 'updateBotShippingQuery', _update: true, query_id: i64(), user_id: i32(), payload: bytes(), shipping_address: obj() });
const _updateBotPrecheckoutQuery = (): any => {
  const result: Record<string, unknown> = { _: 'updateBotPrecheckoutQuery' };
  result._update = true;
  const flags = i32();
  result.query_id = i64();
  result.user_id = i32();
  result.payload = bytes();
  if (flags & 0x1) result.info = obj();
  if (flags & 0x2) result.shipping_option_id = str();
  result.currency = str();
  result.total_amount = i64();
  return result;
};
const _updatePhoneCall: any = () => ({ _: 'updatePhoneCall', _update: true, phone_call: obj() });
const _updateLangPackTooLong: any = () => ({ _: 'updateLangPackTooLong', _update: true, lang_code: str() });
const _updateLangPack: any = () => ({ _: 'updateLangPack', _update: true, difference: obj() });
const _updateFavedStickers: any = () => ({ _: 'updateFavedStickers', _update: true });
const _updateChannelReadMessagesContents: any = () => ({ _: 'updateChannelReadMessagesContents', _update: true, channel_id: i32(), messages: vector(i32) });
const _updateContactsReset: any = () => ({ _: 'updateContactsReset', _update: true });
const _updateChannelAvailableMessages: any = () => ({ _: 'updateChannelAvailableMessages', _update: true, channel_id: i32(), available_min_id: i32() });
const _updateDialogUnreadMark = (): any => {
  const result: Record<string, unknown> = { _: 'updateDialogUnreadMark' };
  result._update = true;
  const flags = i32();
  result.unread = !!(flags & 0x1);
  result.peer = obj();
  return result;
};
const _updateUserPinnedMessage: any = () => ({ _: 'updateUserPinnedMessage', _update: true, user_id: i32(), id: i32() });
const _updateChatPinnedMessage: any = () => ({ _: 'updateChatPinnedMessage', _update: true, chat_id: i32(), id: i32(), version: i32() });
const _updateMessagePoll = (): any => {
  const result: Record<string, unknown> = { _: 'updateMessagePoll' };
  result._update = true;
  const flags = i32();
  result.poll_id = i64();
  if (flags & 0x1) result.poll = obj();
  result.results = obj();
  return result;
};
const _updateChatDefaultBannedRights: any = () => ({ _: 'updateChatDefaultBannedRights', _update: true, peer: obj(), default_banned_rights: obj(), version: i32() });
const _updateFolderPeers: any = () => ({ _: 'updateFolderPeers', _update: true, folder_peers: vector(obj), pts: i32(), pts_count: i32() });
const _updatePeerSettings: any = () => ({ _: 'updatePeerSettings', _update: true, peer: obj(), settings: obj() });
const _updatePeerLocated: any = () => ({ _: 'updatePeerLocated', _update: true, peers: vector(obj) });
const _updateNewScheduledMessage: any = () => ({ _: 'updateNewScheduledMessage', _update: true, message: obj() });
const _updateDeleteScheduledMessages: any = () => ({ _: 'updateDeleteScheduledMessages', _update: true, peer: obj(), messages: vector(i32) });
const _updateTheme: any = () => ({ _: 'updateTheme', _update: true, theme: obj() });
const _updateGeoLiveViewed: any = () => ({ _: 'updateGeoLiveViewed', _update: true, peer: obj(), msg_id: i32() });
const _updateLoginToken: any = () => ({ _: 'updateLoginToken', _update: true });
const _updateMessagePollVote: any = () => ({ _: 'updateMessagePollVote', _update: true, poll_id: i64(), user_id: i32(), options: vector(bytes) });
const _updateDialogFilter = (): any => {
  const result: Record<string, unknown> = { _: 'updateDialogFilter' };
  result._update = true;
  const flags = i32();
  result.id = i32();
  if (flags & 0x1) result.filter = obj();
  return result;
};
const _updateDialogFilterOrder: any = () => ({ _: 'updateDialogFilterOrder', _update: true, order: vector(i32) });
const _updateDialogFilters: any = () => ({ _: 'updateDialogFilters', _update: true });
const _updatesState: any = () => ({ _: 'updates.state', pts: i32(), qts: i32(), date: i32(), seq: i32(), unread_count: i32() });
const _updatesDifferenceEmpty: any = () => ({ _: 'updates.differenceEmpty', date: i32(), seq: i32() });
const _updatesDifference: any = () => ({ _: 'updates.difference', new_messages: vector(obj), new_encrypted_messages: vector(obj), other_updates: vector(obj), chats: vector(obj), users: vector(obj), state: obj() });
const _updatesDifferenceSlice: any = () => ({ _: 'updates.differenceSlice', new_messages: vector(obj), new_encrypted_messages: vector(obj), other_updates: vector(obj), chats: vector(obj), users: vector(obj), intermediate_state: obj() });
const _updatesDifferenceTooLong: any = () => ({ _: 'updates.differenceTooLong', pts: i32() });
const _updatesTooLong: any = () => ({ _: 'updatesTooLong', _update: true });
const _updateShortMessage = (): any => {
  const result: Record<string, unknown> = { _: 'updateShortMessage' };
  result._update = true;
  const flags = i32();
  result.out = !!(flags & 0x2);
  result.mentioned = !!(flags & 0x10);
  result.media_unread = !!(flags & 0x20);
  result.silent = !!(flags & 0x2000);
  result.id = i32();
  result.user_id = i32();
  result.message = str();
  result.pts = i32();
  result.pts_count = i32();
  result.date = i32();
  if (flags & 0x4) result.fwd_from = obj();
  if (flags & 0x800) result.via_bot_id = i32();
  if (flags & 0x8) result.reply_to_msg_id = i32();
  if (flags & 0x80) result.entities = vector(obj);
  return result;
};
const _updateShortChatMessage = (): any => {
  const result: Record<string, unknown> = { _: 'updateShortChatMessage' };
  result._update = true;
  const flags = i32();
  result.out = !!(flags & 0x2);
  result.mentioned = !!(flags & 0x10);
  result.media_unread = !!(flags & 0x20);
  result.silent = !!(flags & 0x2000);
  result.id = i32();
  result.from_id = i32();
  result.chat_id = i32();
  result.message = str();
  result.pts = i32();
  result.pts_count = i32();
  result.date = i32();
  if (flags & 0x4) result.fwd_from = obj();
  if (flags & 0x800) result.via_bot_id = i32();
  if (flags & 0x8) result.reply_to_msg_id = i32();
  if (flags & 0x80) result.entities = vector(obj);
  return result;
};
const _updateShort: any = () => ({ _: 'updateShort', _update: true, update: obj(), date: i32() });
const _updatesCombined: any = () => ({ _: 'updatesCombined', _update: true, updates: vector(obj), users: vector(obj), chats: vector(obj), date: i32(), seq_start: i32(), seq: i32() });
const _updates: any = () => ({ _: 'updates', _update: true, updates: vector(obj), users: vector(obj), chats: vector(obj), date: i32(), seq: i32() });
const _updateShortSentMessage = (): any => {
  const result: Record<string, unknown> = { _: 'updateShortSentMessage' };
  result._update = true;
  const flags = i32();
  result.out = !!(flags & 0x2);
  result.id = i32();
  result.pts = i32();
  result.pts_count = i32();
  result.date = i32();
  if (flags & 0x200) result.media = obj();
  if (flags & 0x80) result.entities = vector(obj);
  return result;
};
const _photosPhotos: any = () => ({ _: 'photos.photos', photos: vector(obj), users: vector(obj) });
const _photosPhotosSlice: any = () => ({ _: 'photos.photosSlice', count: i32(), photos: vector(obj), users: vector(obj) });
const _photosPhoto: any = () => ({ _: 'photos.photo', photo: obj(), users: vector(obj) });
const _uploadFile: any = () => ({ _: 'upload.file', type: obj(), mtime: i32(), bytes: bytes() });
const _uploadFileCdnRedirect: any = () => ({ _: 'upload.fileCdnRedirect', dc_id: i32(), file_token: bytes(), encryption_key: bytes(), encryption_iv: bytes(), file_hashes: vector(obj) });
const _dcOption = (): any => {
  const result: Record<string, unknown> = { _: 'dcOption' };
  const flags = i32();
  result.ipv6 = !!(flags & 0x1);
  result.media_only = !!(flags & 0x2);
  result.tcpo_only = !!(flags & 0x4);
  result.cdn = !!(flags & 0x8);
  result.static = !!(flags & 0x10);
  result.id = i32();
  result.ip_address = str();
  result.port = i32();
  if (flags & 0x400) result.secret = bytes();
  return result;
};
const _config = (): any => {
  const result: Record<string, unknown> = { _: 'config' };
  const flags = i32();
  result.phonecalls_enabled = !!(flags & 0x2);
  result.default_p2p_contacts = !!(flags & 0x8);
  result.preload_featured_stickers = !!(flags & 0x10);
  result.ignore_phone_entities = !!(flags & 0x20);
  result.revoke_pm_inbox = !!(flags & 0x40);
  result.blocked_mode = !!(flags & 0x100);
  result.pfs_enabled = !!(flags & 0x2000);
  result.date = i32();
  result.expires = i32();
  result.test_mode = obj();
  result.this_dc = i32();
  result.dc_options = vector(obj);
  result.dc_txt_domain_name = str();
  result.chat_size_max = i32();
  result.megagroup_size_max = i32();
  result.forwarded_count_max = i32();
  result.online_update_period_ms = i32();
  result.offline_blur_timeout_ms = i32();
  result.offline_idle_timeout_ms = i32();
  result.online_cloud_timeout_ms = i32();
  result.notify_cloud_delay_ms = i32();
  result.notify_default_delay_ms = i32();
  result.push_chat_period_ms = i32();
  result.push_chat_limit = i32();
  result.saved_gifs_limit = i32();
  result.edit_time_limit = i32();
  result.revoke_time_limit = i32();
  result.revoke_pm_time_limit = i32();
  result.rating_e_decay = i32();
  result.stickers_recent_limit = i32();
  result.stickers_faved_limit = i32();
  result.channels_read_media_period = i32();
  if (flags & 0x1) result.tmp_sessions = i32();
  result.pinned_dialogs_count_max = i32();
  result.pinned_infolder_count_max = i32();
  result.call_receive_timeout_ms = i32();
  result.call_ring_timeout_ms = i32();
  result.call_connect_timeout_ms = i32();
  result.call_packet_timeout_ms = i32();
  result.me_url_prefix = str();
  if (flags & 0x80) result.autoupdate_url_prefix = str();
  if (flags & 0x200) result.gif_search_username = str();
  if (flags & 0x400) result.venue_search_username = str();
  if (flags & 0x800) result.img_search_username = str();
  if (flags & 0x1000) result.static_maps_provider = str();
  result.caption_length_max = i32();
  result.message_length_max = i32();
  result.webfile_dc_id = i32();
  if (flags & 0x4) result.suggested_lang_code = str();
  if (flags & 0x4) result.lang_pack_version = i32();
  if (flags & 0x4) result.base_lang_pack_version = i32();
  return result;
};
const _nearestDc: any = () => ({ _: 'nearestDc', country: str(), this_dc: i32(), nearest_dc: i32() });
const _helpAppUpdate = (): any => {
  const result: Record<string, unknown> = { _: 'help.appUpdate' };
  const flags = i32();
  result.can_not_skip = !!(flags & 0x1);
  result.id = i32();
  result.version = str();
  result.text = str();
  result.entities = vector(obj);
  if (flags & 0x2) result.document = obj();
  if (flags & 0x4) result.url = str();
  return result;
};
const _helpNoAppUpdate: any = () => ({ _: 'help.noAppUpdate' });
const _helpInviteText: any = () => ({ _: 'help.inviteText', message: str() });
const _encryptedChatEmpty: any = () => ({ _: 'encryptedChatEmpty', id: i32() });
const _encryptedChatWaiting: any = () => ({ _: 'encryptedChatWaiting', id: i32(), access_hash: i64(), date: i32(), admin_id: i32(), participant_id: i32() });
const _encryptedChatRequested: any = () => ({ _: 'encryptedChatRequested', id: i32(), access_hash: i64(), date: i32(), admin_id: i32(), participant_id: i32(), g_a: bytes() });
const _encryptedChat: any = () => ({ _: 'encryptedChat', id: i32(), access_hash: i64(), date: i32(), admin_id: i32(), participant_id: i32(), g_a_or_b: bytes(), key_fingerprint: i64() });
const _encryptedChatDiscarded: any = () => ({ _: 'encryptedChatDiscarded', id: i32() });
const _inputEncryptedChat: any = () => ({ _: 'inputEncryptedChat', chat_id: i32(), access_hash: i64() });
const _encryptedFileEmpty: any = () => ({ _: 'encryptedFileEmpty' });
const _encryptedFile: any = () => ({ _: 'encryptedFile', id: i64(), access_hash: i64(), size: i32(), dc_id: i32(), key_fingerprint: i32() });
const _inputEncryptedFileEmpty: any = () => ({ _: 'inputEncryptedFileEmpty' });
const _inputEncryptedFileUploaded: any = () => ({ _: 'inputEncryptedFileUploaded', id: i64(), parts: i32(), md5_checksum: str(), key_fingerprint: i32() });
const _inputEncryptedFile: any = () => ({ _: 'inputEncryptedFile', id: i64(), access_hash: i64() });
const _inputEncryptedFileBigUploaded: any = () => ({ _: 'inputEncryptedFileBigUploaded', id: i64(), parts: i32(), key_fingerprint: i32() });
const _encryptedMessage: any = () => ({ _: 'encryptedMessage', random_id: i64(), chat_id: i32(), date: i32(), bytes: bytes(), file: obj() });
const _encryptedMessageService: any = () => ({ _: 'encryptedMessageService', random_id: i64(), chat_id: i32(), date: i32(), bytes: bytes() });
const _messagesDhConfigNotModified: any = () => ({ _: 'messages.dhConfigNotModified', random: bytes() });
const _messagesDhConfig: any = () => ({ _: 'messages.dhConfig', g: i32(), p: bytes(), version: i32(), random: bytes() });
const _messagesSentEncryptedMessage: any = () => ({ _: 'messages.sentEncryptedMessage', date: i32() });
const _messagesSentEncryptedFile: any = () => ({ _: 'messages.sentEncryptedFile', date: i32(), file: obj() });
const _inputDocumentEmpty: any = () => ({ _: 'inputDocumentEmpty' });
const _inputDocument: any = () => ({ _: 'inputDocument', id: i64(), access_hash: i64(), file_reference: bytes() });
const _documentEmpty: any = () => ({ _: 'documentEmpty', id: i64() });
const _document = (): any => {
  const result: Record<string, unknown> = { _: 'document' };
  const flags = i32();
  result.id = i64();
  result.access_hash = i64();
  result.file_reference = bytes();
  result.date = i32();
  result.mime_type = str();
  result.size = i32();
  if (flags & 0x1) result.thumbs = vector(obj);
  result.dc_id = i32();
  result.attributes = vector(obj);
  return result;
};
const _helpSupport: any = () => ({ _: 'help.support', phone_number: str(), user: obj() });
const _notifyPeer: any = () => ({ _: 'notifyPeer', peer: obj() });
const _notifyUsers: any = () => ({ _: 'notifyUsers' });
const _notifyChats: any = () => ({ _: 'notifyChats' });
const _notifyBroadcasts: any = () => ({ _: 'notifyBroadcasts' });
const _sendMessageTypingAction: any = () => ({ _: 'sendMessageTypingAction' });
const _sendMessageCancelAction: any = () => ({ _: 'sendMessageCancelAction' });
const _sendMessageRecordVideoAction: any = () => ({ _: 'sendMessageRecordVideoAction' });
const _sendMessageUploadVideoAction: any = () => ({ _: 'sendMessageUploadVideoAction', progress: i32() });
const _sendMessageRecordAudioAction: any = () => ({ _: 'sendMessageRecordAudioAction' });
const _sendMessageUploadAudioAction: any = () => ({ _: 'sendMessageUploadAudioAction', progress: i32() });
const _sendMessageUploadPhotoAction: any = () => ({ _: 'sendMessageUploadPhotoAction', progress: i32() });
const _sendMessageUploadDocumentAction: any = () => ({ _: 'sendMessageUploadDocumentAction', progress: i32() });
const _sendMessageGeoLocationAction: any = () => ({ _: 'sendMessageGeoLocationAction' });
const _sendMessageChooseContactAction: any = () => ({ _: 'sendMessageChooseContactAction' });
const _sendMessageGamePlayAction: any = () => ({ _: 'sendMessageGamePlayAction' });
const _sendMessageRecordRoundAction: any = () => ({ _: 'sendMessageRecordRoundAction' });
const _sendMessageUploadRoundAction: any = () => ({ _: 'sendMessageUploadRoundAction', progress: i32() });
const _contactsFound: any = () => ({ _: 'contacts.found', my_results: vector(obj), results: vector(obj), chats: vector(obj), users: vector(obj) });
const _inputPrivacyKeyStatusTimestamp: any = () => ({ _: 'inputPrivacyKeyStatusTimestamp' });
const _inputPrivacyKeyChatInvite: any = () => ({ _: 'inputPrivacyKeyChatInvite' });
const _inputPrivacyKeyPhoneCall: any = () => ({ _: 'inputPrivacyKeyPhoneCall' });
const _inputPrivacyKeyPhoneP2P: any = () => ({ _: 'inputPrivacyKeyPhoneP2P' });
const _inputPrivacyKeyForwards: any = () => ({ _: 'inputPrivacyKeyForwards' });
const _inputPrivacyKeyProfilePhoto: any = () => ({ _: 'inputPrivacyKeyProfilePhoto' });
const _inputPrivacyKeyPhoneNumber: any = () => ({ _: 'inputPrivacyKeyPhoneNumber' });
const _inputPrivacyKeyAddedByPhone: any = () => ({ _: 'inputPrivacyKeyAddedByPhone' });
const _privacyKeyStatusTimestamp: any = () => ({ _: 'privacyKeyStatusTimestamp' });
const _privacyKeyChatInvite: any = () => ({ _: 'privacyKeyChatInvite' });
const _privacyKeyPhoneCall: any = () => ({ _: 'privacyKeyPhoneCall' });
const _privacyKeyPhoneP2P: any = () => ({ _: 'privacyKeyPhoneP2P' });
const _privacyKeyForwards: any = () => ({ _: 'privacyKeyForwards' });
const _privacyKeyProfilePhoto: any = () => ({ _: 'privacyKeyProfilePhoto' });
const _privacyKeyPhoneNumber: any = () => ({ _: 'privacyKeyPhoneNumber' });
const _privacyKeyAddedByPhone: any = () => ({ _: 'privacyKeyAddedByPhone' });
const _inputPrivacyValueAllowContacts: any = () => ({ _: 'inputPrivacyValueAllowContacts' });
const _inputPrivacyValueAllowAll: any = () => ({ _: 'inputPrivacyValueAllowAll' });
const _inputPrivacyValueAllowUsers: any = () => ({ _: 'inputPrivacyValueAllowUsers', users: vector(obj) });
const _inputPrivacyValueDisallowContacts: any = () => ({ _: 'inputPrivacyValueDisallowContacts' });
const _inputPrivacyValueDisallowAll: any = () => ({ _: 'inputPrivacyValueDisallowAll' });
const _inputPrivacyValueDisallowUsers: any = () => ({ _: 'inputPrivacyValueDisallowUsers', users: vector(obj) });
const _inputPrivacyValueAllowChatParticipants: any = () => ({ _: 'inputPrivacyValueAllowChatParticipants', chats: vector(i32) });
const _inputPrivacyValueDisallowChatParticipants: any = () => ({ _: 'inputPrivacyValueDisallowChatParticipants', chats: vector(i32) });
const _privacyValueAllowContacts: any = () => ({ _: 'privacyValueAllowContacts' });
const _privacyValueAllowAll: any = () => ({ _: 'privacyValueAllowAll' });
const _privacyValueAllowUsers: any = () => ({ _: 'privacyValueAllowUsers', users: vector(i32) });
const _privacyValueDisallowContacts: any = () => ({ _: 'privacyValueDisallowContacts' });
const _privacyValueDisallowAll: any = () => ({ _: 'privacyValueDisallowAll' });
const _privacyValueDisallowUsers: any = () => ({ _: 'privacyValueDisallowUsers', users: vector(i32) });
const _privacyValueAllowChatParticipants: any = () => ({ _: 'privacyValueAllowChatParticipants', chats: vector(i32) });
const _privacyValueDisallowChatParticipants: any = () => ({ _: 'privacyValueDisallowChatParticipants', chats: vector(i32) });
const _accountPrivacyRules: any = () => ({ _: 'account.privacyRules', rules: vector(obj), chats: vector(obj), users: vector(obj) });
const _accountDaysTTL: any = () => ({ _: 'accountDaysTTL', days: i32() });
const _documentAttributeImageSize: any = () => ({ _: 'documentAttributeImageSize', w: i32(), h: i32() });
const _documentAttributeAnimated: any = () => ({ _: 'documentAttributeAnimated' });
const _documentAttributeSticker = (): any => {
  const result: Record<string, unknown> = { _: 'documentAttributeSticker' };
  const flags = i32();
  result.mask = !!(flags & 0x2);
  result.alt = str();
  result.stickerset = obj();
  if (flags & 0x1) result.mask_coords = obj();
  return result;
};
const _documentAttributeVideo = (): any => {
  const result: Record<string, unknown> = { _: 'documentAttributeVideo' };
  const flags = i32();
  result.round_message = !!(flags & 0x1);
  result.supports_streaming = !!(flags & 0x2);
  result.duration = i32();
  result.w = i32();
  result.h = i32();
  return result;
};
const _documentAttributeAudio = (): any => {
  const result: Record<string, unknown> = { _: 'documentAttributeAudio' };
  const flags = i32();
  result.voice = !!(flags & 0x400);
  result.duration = i32();
  if (flags & 0x1) result.title = str();
  if (flags & 0x2) result.performer = str();
  if (flags & 0x4) result.waveform = bytes();
  return result;
};
const _documentAttributeFilename: any = () => ({ _: 'documentAttributeFilename', file_name: str() });
const _documentAttributeHasStickers: any = () => ({ _: 'documentAttributeHasStickers' });
const _messagesStickersNotModified: any = () => ({ _: 'messages.stickersNotModified' });
const _messagesStickers: any = () => ({ _: 'messages.stickers', hash: i32(), stickers: vector(obj) });
const _stickerPack: any = () => ({ _: 'stickerPack', emoticon: str(), documents: vector(i64) });
const _messagesAllStickersNotModified: any = () => ({ _: 'messages.allStickersNotModified' });
const _messagesAllStickers: any = () => ({ _: 'messages.allStickers', hash: i32(), sets: vector(obj) });
const _messagesAffectedMessages: any = () => ({ _: 'messages.affectedMessages', pts: i32(), pts_count: i32() });
const _webPageEmpty: any = () => ({ _: 'webPageEmpty', id: i64() });
const _webPagePending: any = () => ({ _: 'webPagePending', id: i64(), date: i32() });
const _webPage = (): any => {
  const result: Record<string, unknown> = { _: 'webPage' };
  const flags = i32();
  result.id = i64();
  result.url = str();
  result.display_url = str();
  result.hash = i32();
  if (flags & 0x1) result.type = str();
  if (flags & 0x2) result.site_name = str();
  if (flags & 0x4) result.title = str();
  if (flags & 0x8) result.description = str();
  if (flags & 0x10) result.photo = obj();
  if (flags & 0x20) result.embed_url = str();
  if (flags & 0x20) result.embed_type = str();
  if (flags & 0x40) result.embed_width = i32();
  if (flags & 0x40) result.embed_height = i32();
  if (flags & 0x80) result.duration = i32();
  if (flags & 0x100) result.author = str();
  if (flags & 0x200) result.document = obj();
  if (flags & 0x400) result.cached_page = obj();
  if (flags & 0x1000) result.attributes = vector(obj);
  return result;
};
const _webPageNotModified = (): any => {
  const result: Record<string, unknown> = { _: 'webPageNotModified' };
  const flags = i32();
  if (flags & 0x1) result.cached_page_views = i32();
  return result;
};
const _authorization = (): any => {
  const result: Record<string, unknown> = { _: 'authorization' };
  const flags = i32();
  result.current = !!(flags & 0x1);
  result.official_app = !!(flags & 0x2);
  result.password_pending = !!(flags & 0x4);
  result.hash = i64();
  result.device_model = str();
  result.platform = str();
  result.system_version = str();
  result.api_id = i32();
  result.app_name = str();
  result.app_version = str();
  result.date_created = i32();
  result.date_active = i32();
  result.ip = str();
  result.country = str();
  result.region = str();
  return result;
};
const _accountAuthorizations: any = () => ({ _: 'account.authorizations', authorizations: vector(obj) });
const _accountPassword = (): any => {
  const result: Record<string, unknown> = { _: 'account.password' };
  const flags = i32();
  result.has_recovery = !!(flags & 0x1);
  result.has_secure_values = !!(flags & 0x2);
  result.has_password = !!(flags & 0x4);
  if (flags & 0x4) result.current_algo = obj();
  if (flags & 0x4) result.srp_B = bytes();
  if (flags & 0x4) result.srp_id = i64();
  if (flags & 0x8) result.hint = str();
  if (flags & 0x10) result.email_unconfirmed_pattern = str();
  result.new_algo = obj();
  result.new_secure_algo = obj();
  result.secure_random = bytes();
  return result;
};
const _accountPasswordSettings = (): any => {
  const result: Record<string, unknown> = { _: 'account.passwordSettings' };
  const flags = i32();
  if (flags & 0x1) result.email = str();
  if (flags & 0x2) result.secure_settings = obj();
  return result;
};
const _accountPasswordInputSettings = (): any => {
  const result: Record<string, unknown> = { _: 'account.passwordInputSettings' };
  const flags = i32();
  if (flags & 0x1) result.new_algo = obj();
  if (flags & 0x1) result.new_password_hash = bytes();
  if (flags & 0x1) result.hint = str();
  if (flags & 0x2) result.email = str();
  if (flags & 0x4) result.new_secure_settings = obj();
  return result;
};
const _authPasswordRecovery: any = () => ({ _: 'auth.passwordRecovery', email_pattern: str() });
const _receivedNotifyMessage: any = () => ({ _: 'receivedNotifyMessage', id: i32(), flags: i32() });
const _chatInviteEmpty: any = () => ({ _: 'chatInviteEmpty' });
const _chatInviteExported: any = () => ({ _: 'chatInviteExported', link: str() });
const _chatInviteAlready: any = () => ({ _: 'chatInviteAlready', chat: obj() });
const _chatInvite = (): any => {
  const result: Record<string, unknown> = { _: 'chatInvite' };
  const flags = i32();
  result.channel = !!(flags & 0x1);
  result.broadcast = !!(flags & 0x2);
  result.public = !!(flags & 0x4);
  result.megagroup = !!(flags & 0x8);
  result.title = str();
  result.photo = obj();
  result.participants_count = i32();
  if (flags & 0x10) result.participants = vector(obj);
  return result;
};
const _inputStickerSetEmpty: any = () => ({ _: 'inputStickerSetEmpty' });
const _inputStickerSetID: any = () => ({ _: 'inputStickerSetID', id: i64(), access_hash: i64() });
const _inputStickerSetShortName: any = () => ({ _: 'inputStickerSetShortName', short_name: str() });
const _inputStickerSetAnimatedEmoji: any = () => ({ _: 'inputStickerSetAnimatedEmoji' });
const _inputStickerSetDice: any = () => ({ _: 'inputStickerSetDice', emoticon: str() });
const _stickerSet = (): any => {
  const result: Record<string, unknown> = { _: 'stickerSet' };
  const flags = i32();
  result.archived = !!(flags & 0x2);
  result.official = !!(flags & 0x4);
  result.masks = !!(flags & 0x8);
  result.animated = !!(flags & 0x20);
  if (flags & 0x1) result.installed_date = i32();
  result.id = i64();
  result.access_hash = i64();
  result.title = str();
  result.short_name = str();
  if (flags & 0x10) result.thumb = obj();
  if (flags & 0x10) result.thumb_dc_id = i32();
  result.count = i32();
  result.hash = i32();
  return result;
};
const _messagesStickerSet: any = () => ({ _: 'messages.stickerSet', set: obj(), packs: vector(obj), documents: vector(obj) });
const _botCommand: any = () => ({ _: 'botCommand', command: str(), description: str() });
const _botInfo: any = () => ({ _: 'botInfo', user_id: i32(), description: str(), commands: vector(obj) });
const _keyboardButton: any = () => ({ _: 'keyboardButton', text: str() });
const _keyboardButtonUrl: any = () => ({ _: 'keyboardButtonUrl', text: str(), url: str() });
const _keyboardButtonCallback: any = () => ({ _: 'keyboardButtonCallback', text: str(), data: bytes() });
const _keyboardButtonRequestPhone: any = () => ({ _: 'keyboardButtonRequestPhone', text: str() });
const _keyboardButtonRequestGeoLocation: any = () => ({ _: 'keyboardButtonRequestGeoLocation', text: str() });
const _keyboardButtonSwitchInline = (): any => {
  const result: Record<string, unknown> = { _: 'keyboardButtonSwitchInline' };
  const flags = i32();
  result.same_peer = !!(flags & 0x1);
  result.text = str();
  result.query = str();
  return result;
};
const _keyboardButtonGame: any = () => ({ _: 'keyboardButtonGame', text: str() });
const _keyboardButtonBuy: any = () => ({ _: 'keyboardButtonBuy', text: str() });
const _keyboardButtonUrlAuth = (): any => {
  const result: Record<string, unknown> = { _: 'keyboardButtonUrlAuth' };
  const flags = i32();
  result.text = str();
  if (flags & 0x1) result.fwd_text = str();
  result.url = str();
  result.button_id = i32();
  return result;
};
const _inputKeyboardButtonUrlAuth = (): any => {
  const result: Record<string, unknown> = { _: 'inputKeyboardButtonUrlAuth' };
  const flags = i32();
  result.request_write_access = !!(flags & 0x1);
  result.text = str();
  if (flags & 0x2) result.fwd_text = str();
  result.url = str();
  result.bot = obj();
  return result;
};
const _keyboardButtonRequestPoll = (): any => {
  const result: Record<string, unknown> = { _: 'keyboardButtonRequestPoll' };
  const flags = i32();
  if (flags & 0x1) result.quiz = obj();
  result.text = str();
  return result;
};
const _keyboardButtonRow: any = () => ({ _: 'keyboardButtonRow', buttons: vector(obj) });
const _replyKeyboardHide = (): any => {
  const result: Record<string, unknown> = { _: 'replyKeyboardHide' };
  const flags = i32();
  result.selective = !!(flags & 0x4);
  return result;
};
const _replyKeyboardForceReply = (): any => {
  const result: Record<string, unknown> = { _: 'replyKeyboardForceReply' };
  const flags = i32();
  result.single_use = !!(flags & 0x2);
  result.selective = !!(flags & 0x4);
  return result;
};
const _replyKeyboardMarkup = (): any => {
  const result: Record<string, unknown> = { _: 'replyKeyboardMarkup' };
  const flags = i32();
  result.resize = !!(flags & 0x1);
  result.single_use = !!(flags & 0x2);
  result.selective = !!(flags & 0x4);
  result.rows = vector(obj);
  return result;
};
const _replyInlineMarkup: any = () => ({ _: 'replyInlineMarkup', rows: vector(obj) });
const _messageEntityUnknown: any = () => ({ _: 'messageEntityUnknown', offset: i32(), length: i32() });
const _messageEntityMention: any = () => ({ _: 'messageEntityMention', offset: i32(), length: i32() });
const _messageEntityHashtag: any = () => ({ _: 'messageEntityHashtag', offset: i32(), length: i32() });
const _messageEntityBotCommand: any = () => ({ _: 'messageEntityBotCommand', offset: i32(), length: i32() });
const _messageEntityUrl: any = () => ({ _: 'messageEntityUrl', offset: i32(), length: i32() });
const _messageEntityEmail: any = () => ({ _: 'messageEntityEmail', offset: i32(), length: i32() });
const _messageEntityBold: any = () => ({ _: 'messageEntityBold', offset: i32(), length: i32() });
const _messageEntityItalic: any = () => ({ _: 'messageEntityItalic', offset: i32(), length: i32() });
const _messageEntityCode: any = () => ({ _: 'messageEntityCode', offset: i32(), length: i32() });
const _messageEntityPre: any = () => ({ _: 'messageEntityPre', offset: i32(), length: i32(), language: str() });
const _messageEntityTextUrl: any = () => ({ _: 'messageEntityTextUrl', offset: i32(), length: i32(), url: str() });
const _messageEntityMentionName: any = () => ({ _: 'messageEntityMentionName', offset: i32(), length: i32(), user_id: i32() });
const _inputMessageEntityMentionName: any = () => ({ _: 'inputMessageEntityMentionName', offset: i32(), length: i32(), user_id: obj() });
const _messageEntityPhone: any = () => ({ _: 'messageEntityPhone', offset: i32(), length: i32() });
const _messageEntityCashtag: any = () => ({ _: 'messageEntityCashtag', offset: i32(), length: i32() });
const _messageEntityUnderline: any = () => ({ _: 'messageEntityUnderline', offset: i32(), length: i32() });
const _messageEntityStrike: any = () => ({ _: 'messageEntityStrike', offset: i32(), length: i32() });
const _messageEntityBlockquote: any = () => ({ _: 'messageEntityBlockquote', offset: i32(), length: i32() });
const _messageEntityBankCard: any = () => ({ _: 'messageEntityBankCard', offset: i32(), length: i32() });
const _inputChannelEmpty: any = () => ({ _: 'inputChannelEmpty' });
const _inputChannel: any = () => ({ _: 'inputChannel', channel_id: i32(), access_hash: i64() });
const _inputChannelFromMessage: any = () => ({ _: 'inputChannelFromMessage', peer: obj(), msg_id: i32(), channel_id: i32() });
const _contactsResolvedPeer: any = () => ({ _: 'contacts.resolvedPeer', peer: obj(), chats: vector(obj), users: vector(obj) });
const _messageRange: any = () => ({ _: 'messageRange', min_id: i32(), max_id: i32() });
const _updatesChannelDifferenceEmpty = (): any => {
  const result: Record<string, unknown> = { _: 'updates.channelDifferenceEmpty' };
  const flags = i32();
  result.final = !!(flags & 0x1);
  result.pts = i32();
  if (flags & 0x2) result.timeout = i32();
  return result;
};
const _updatesChannelDifferenceTooLong = (): any => {
  const result: Record<string, unknown> = { _: 'updates.channelDifferenceTooLong' };
  const flags = i32();
  result.final = !!(flags & 0x1);
  if (flags & 0x2) result.timeout = i32();
  result.dialog = obj();
  result.messages = vector(obj);
  result.chats = vector(obj);
  result.users = vector(obj);
  return result;
};
const _updatesChannelDifference = (): any => {
  const result: Record<string, unknown> = { _: 'updates.channelDifference' };
  const flags = i32();
  result.final = !!(flags & 0x1);
  result.pts = i32();
  if (flags & 0x2) result.timeout = i32();
  result.new_messages = vector(obj);
  result.other_updates = vector(obj);
  result.chats = vector(obj);
  result.users = vector(obj);
  return result;
};
const _channelMessagesFilterEmpty: any = () => ({ _: 'channelMessagesFilterEmpty' });
const _channelMessagesFilter = (): any => {
  const result: Record<string, unknown> = { _: 'channelMessagesFilter' };
  const flags = i32();
  result.exclude_new_messages = !!(flags & 0x2);
  result.ranges = vector(obj);
  return result;
};
const _channelParticipant: any = () => ({ _: 'channelParticipant', user_id: i32(), date: i32() });
const _channelParticipantSelf: any = () => ({ _: 'channelParticipantSelf', user_id: i32(), inviter_id: i32(), date: i32() });
const _channelParticipantCreator = (): any => {
  const result: Record<string, unknown> = { _: 'channelParticipantCreator' };
  const flags = i32();
  result.user_id = i32();
  if (flags & 0x1) result.rank = str();
  return result;
};
const _channelParticipantAdmin = (): any => {
  const result: Record<string, unknown> = { _: 'channelParticipantAdmin' };
  const flags = i32();
  result.can_edit = !!(flags & 0x1);
  result.self = !!(flags & 0x2);
  result.user_id = i32();
  if (flags & 0x2) result.inviter_id = i32();
  result.promoted_by = i32();
  result.date = i32();
  result.admin_rights = obj();
  if (flags & 0x4) result.rank = str();
  return result;
};
const _channelParticipantBanned = (): any => {
  const result: Record<string, unknown> = { _: 'channelParticipantBanned' };
  const flags = i32();
  result.left = !!(flags & 0x1);
  result.user_id = i32();
  result.kicked_by = i32();
  result.date = i32();
  result.banned_rights = obj();
  return result;
};
const _channelParticipantsRecent: any = () => ({ _: 'channelParticipantsRecent' });
const _channelParticipantsAdmins: any = () => ({ _: 'channelParticipantsAdmins' });
const _channelParticipantsKicked: any = () => ({ _: 'channelParticipantsKicked', q: str() });
const _channelParticipantsBots: any = () => ({ _: 'channelParticipantsBots' });
const _channelParticipantsBanned: any = () => ({ _: 'channelParticipantsBanned', q: str() });
const _channelParticipantsSearch: any = () => ({ _: 'channelParticipantsSearch', q: str() });
const _channelParticipantsContacts: any = () => ({ _: 'channelParticipantsContacts', q: str() });
const _channelsChannelParticipants: any = () => ({ _: 'channels.channelParticipants', count: i32(), participants: vector(obj), users: vector(obj) });
const _channelsChannelParticipantsNotModified: any = () => ({ _: 'channels.channelParticipantsNotModified' });
const _channelsChannelParticipant: any = () => ({ _: 'channels.channelParticipant', participant: obj(), users: vector(obj) });
const _helpTermsOfService = (): any => {
  const result: Record<string, unknown> = { _: 'help.termsOfService' };
  const flags = i32();
  result.popup = !!(flags & 0x1);
  result.id = obj();
  result.text = str();
  result.entities = vector(obj);
  if (flags & 0x2) result.min_age_confirm = i32();
  return result;
};
const _foundGif: any = () => ({ _: 'foundGif', url: str(), thumb_url: str(), content_url: str(), content_type: str(), w: i32(), h: i32() });
const _foundGifCached: any = () => ({ _: 'foundGifCached', url: str(), photo: obj(), document: obj() });
const _messagesFoundGifs: any = () => ({ _: 'messages.foundGifs', next_offset: i32(), results: vector(obj) });
const _messagesSavedGifsNotModified: any = () => ({ _: 'messages.savedGifsNotModified' });
const _messagesSavedGifs: any = () => ({ _: 'messages.savedGifs', hash: i32(), gifs: vector(obj) });
const _inputBotInlineMessageMediaAuto = (): any => {
  const result: Record<string, unknown> = { _: 'inputBotInlineMessageMediaAuto' };
  const flags = i32();
  result.message = str();
  if (flags & 0x2) result.entities = vector(obj);
  if (flags & 0x4) result.reply_markup = obj();
  return result;
};
const _inputBotInlineMessageText = (): any => {
  const result: Record<string, unknown> = { _: 'inputBotInlineMessageText' };
  const flags = i32();
  result.no_webpage = !!(flags & 0x1);
  result.message = str();
  if (flags & 0x2) result.entities = vector(obj);
  if (flags & 0x4) result.reply_markup = obj();
  return result;
};
const _inputBotInlineMessageMediaGeo = (): any => {
  const result: Record<string, unknown> = { _: 'inputBotInlineMessageMediaGeo' };
  const flags = i32();
  result.geo_point = obj();
  result.period = i32();
  if (flags & 0x4) result.reply_markup = obj();
  return result;
};
const _inputBotInlineMessageMediaVenue = (): any => {
  const result: Record<string, unknown> = { _: 'inputBotInlineMessageMediaVenue' };
  const flags = i32();
  result.geo_point = obj();
  result.title = str();
  result.address = str();
  result.provider = str();
  result.venue_id = str();
  result.venue_type = str();
  if (flags & 0x4) result.reply_markup = obj();
  return result;
};
const _inputBotInlineMessageMediaContact = (): any => {
  const result: Record<string, unknown> = { _: 'inputBotInlineMessageMediaContact' };
  const flags = i32();
  result.phone_number = str();
  result.first_name = str();
  result.last_name = str();
  result.vcard = str();
  if (flags & 0x4) result.reply_markup = obj();
  return result;
};
const _inputBotInlineMessageGame = (): any => {
  const result: Record<string, unknown> = { _: 'inputBotInlineMessageGame' };
  const flags = i32();
  if (flags & 0x4) result.reply_markup = obj();
  return result;
};
const _inputBotInlineResult = (): any => {
  const result: Record<string, unknown> = { _: 'inputBotInlineResult' };
  const flags = i32();
  result.id = str();
  result.type = str();
  if (flags & 0x2) result.title = str();
  if (flags & 0x4) result.description = str();
  if (flags & 0x8) result.url = str();
  if (flags & 0x10) result.thumb = obj();
  if (flags & 0x20) result.content = obj();
  result.send_message = obj();
  return result;
};
const _inputBotInlineResultPhoto: any = () => ({ _: 'inputBotInlineResultPhoto', id: str(), type: str(), photo: obj(), send_message: obj() });
const _inputBotInlineResultDocument = (): any => {
  const result: Record<string, unknown> = { _: 'inputBotInlineResultDocument' };
  const flags = i32();
  result.id = str();
  result.type = str();
  if (flags & 0x2) result.title = str();
  if (flags & 0x4) result.description = str();
  result.document = obj();
  result.send_message = obj();
  return result;
};
const _inputBotInlineResultGame: any = () => ({ _: 'inputBotInlineResultGame', id: str(), short_name: str(), send_message: obj() });
const _botInlineMessageMediaAuto = (): any => {
  const result: Record<string, unknown> = { _: 'botInlineMessageMediaAuto' };
  const flags = i32();
  result.message = str();
  if (flags & 0x2) result.entities = vector(obj);
  if (flags & 0x4) result.reply_markup = obj();
  return result;
};
const _botInlineMessageText = (): any => {
  const result: Record<string, unknown> = { _: 'botInlineMessageText' };
  const flags = i32();
  result.no_webpage = !!(flags & 0x1);
  result.message = str();
  if (flags & 0x2) result.entities = vector(obj);
  if (flags & 0x4) result.reply_markup = obj();
  return result;
};
const _botInlineMessageMediaGeo = (): any => {
  const result: Record<string, unknown> = { _: 'botInlineMessageMediaGeo' };
  const flags = i32();
  result.geo = obj();
  result.period = i32();
  if (flags & 0x4) result.reply_markup = obj();
  return result;
};
const _botInlineMessageMediaVenue = (): any => {
  const result: Record<string, unknown> = { _: 'botInlineMessageMediaVenue' };
  const flags = i32();
  result.geo = obj();
  result.title = str();
  result.address = str();
  result.provider = str();
  result.venue_id = str();
  result.venue_type = str();
  if (flags & 0x4) result.reply_markup = obj();
  return result;
};
const _botInlineMessageMediaContact = (): any => {
  const result: Record<string, unknown> = { _: 'botInlineMessageMediaContact' };
  const flags = i32();
  result.phone_number = str();
  result.first_name = str();
  result.last_name = str();
  result.vcard = str();
  if (flags & 0x4) result.reply_markup = obj();
  return result;
};
const _botInlineResult = (): any => {
  const result: Record<string, unknown> = { _: 'botInlineResult' };
  const flags = i32();
  result.id = str();
  result.type = str();
  if (flags & 0x2) result.title = str();
  if (flags & 0x4) result.description = str();
  if (flags & 0x8) result.url = str();
  if (flags & 0x10) result.thumb = obj();
  if (flags & 0x20) result.content = obj();
  result.send_message = obj();
  return result;
};
const _botInlineMediaResult = (): any => {
  const result: Record<string, unknown> = { _: 'botInlineMediaResult' };
  const flags = i32();
  result.id = str();
  result.type = str();
  if (flags & 0x1) result.photo = obj();
  if (flags & 0x2) result.document = obj();
  if (flags & 0x4) result.title = str();
  if (flags & 0x8) result.description = str();
  result.send_message = obj();
  return result;
};
const _messagesBotResults = (): any => {
  const result: Record<string, unknown> = { _: 'messages.botResults' };
  const flags = i32();
  result.gallery = !!(flags & 0x1);
  result.query_id = i64();
  if (flags & 0x2) result.next_offset = str();
  if (flags & 0x4) result.switch_pm = obj();
  result.results = vector(obj);
  result.cache_time = i32();
  result.users = vector(obj);
  return result;
};
const _exportedMessageLink: any = () => ({ _: 'exportedMessageLink', link: str(), html: str() });
const _messageFwdHeader = (): any => {
  const result: Record<string, unknown> = { _: 'messageFwdHeader' };
  const flags = i32();
  if (flags & 0x1) result.from_id = i32();
  if (flags & 0x20) result.from_name = str();
  result.date = i32();
  if (flags & 0x2) result.channel_id = i32();
  if (flags & 0x4) result.channel_post = i32();
  if (flags & 0x8) result.post_author = str();
  if (flags & 0x10) result.saved_from_peer = obj();
  if (flags & 0x10) result.saved_from_msg_id = i32();
  if (flags & 0x40) result.psa_type = str();
  return result;
};
const _authCodeTypeSms: any = () => ({ _: 'auth.codeTypeSms' });
const _authCodeTypeCall: any = () => ({ _: 'auth.codeTypeCall' });
const _authCodeTypeFlashCall: any = () => ({ _: 'auth.codeTypeFlashCall' });
const _authSentCodeTypeApp: any = () => ({ _: 'auth.sentCodeTypeApp', length: i32() });
const _authSentCodeTypeSms: any = () => ({ _: 'auth.sentCodeTypeSms', length: i32() });
const _authSentCodeTypeCall: any = () => ({ _: 'auth.sentCodeTypeCall', length: i32() });
const _authSentCodeTypeFlashCall: any = () => ({ _: 'auth.sentCodeTypeFlashCall', pattern: str() });
const _messagesBotCallbackAnswer = (): any => {
  const result: Record<string, unknown> = { _: 'messages.botCallbackAnswer' };
  const flags = i32();
  result.alert = !!(flags & 0x2);
  result.has_url = !!(flags & 0x8);
  result.native_ui = !!(flags & 0x10);
  if (flags & 0x1) result.message = str();
  if (flags & 0x4) result.url = str();
  result.cache_time = i32();
  return result;
};
const _messagesMessageEditData = (): any => {
  const result: Record<string, unknown> = { _: 'messages.messageEditData' };
  const flags = i32();
  result.caption = !!(flags & 0x1);
  return result;
};
const _inputBotInlineMessageID: any = () => ({ _: 'inputBotInlineMessageID', dc_id: i32(), id: i64(), access_hash: i64() });
const _inlineBotSwitchPM: any = () => ({ _: 'inlineBotSwitchPM', text: str(), start_param: str() });
const _messagesPeerDialogs: any = () => ({ _: 'messages.peerDialogs', dialogs: vector(obj), messages: vector(obj), chats: vector(obj), users: vector(obj), state: obj() });
const _topPeer: any = () => ({ _: 'topPeer', peer: obj(), rating: f64() });
const _topPeerCategoryBotsPM: any = () => ({ _: 'topPeerCategoryBotsPM' });
const _topPeerCategoryBotsInline: any = () => ({ _: 'topPeerCategoryBotsInline' });
const _topPeerCategoryCorrespondents: any = () => ({ _: 'topPeerCategoryCorrespondents' });
const _topPeerCategoryGroups: any = () => ({ _: 'topPeerCategoryGroups' });
const _topPeerCategoryChannels: any = () => ({ _: 'topPeerCategoryChannels' });
const _topPeerCategoryPhoneCalls: any = () => ({ _: 'topPeerCategoryPhoneCalls' });
const _topPeerCategoryForwardUsers: any = () => ({ _: 'topPeerCategoryForwardUsers' });
const _topPeerCategoryForwardChats: any = () => ({ _: 'topPeerCategoryForwardChats' });
const _topPeerCategoryPeers: any = () => ({ _: 'topPeerCategoryPeers', category: obj(), count: i32(), peers: vector(obj) });
const _contactsTopPeersNotModified: any = () => ({ _: 'contacts.topPeersNotModified' });
const _contactsTopPeers: any = () => ({ _: 'contacts.topPeers', categories: vector(obj), chats: vector(obj), users: vector(obj) });
const _contactsTopPeersDisabled: any = () => ({ _: 'contacts.topPeersDisabled' });
const _draftMessageEmpty = (): any => {
  const result: Record<string, unknown> = { _: 'draftMessageEmpty' };
  const flags = i32();
  if (flags & 0x1) result.date = i32();
  return result;
};
const _draftMessage = (): any => {
  const result: Record<string, unknown> = { _: 'draftMessage' };
  const flags = i32();
  result.no_webpage = !!(flags & 0x2);
  if (flags & 0x1) result.reply_to_msg_id = i32();
  result.message = str();
  if (flags & 0x8) result.entities = vector(obj);
  result.date = i32();
  return result;
};
const _messagesFeaturedStickersNotModified: any = () => ({ _: 'messages.featuredStickersNotModified', count: i32() });
const _messagesFeaturedStickers: any = () => ({ _: 'messages.featuredStickers', hash: i32(), count: i32(), sets: vector(obj), unread: vector(i64) });
const _messagesRecentStickersNotModified: any = () => ({ _: 'messages.recentStickersNotModified' });
const _messagesRecentStickers: any = () => ({ _: 'messages.recentStickers', hash: i32(), packs: vector(obj), stickers: vector(obj), dates: vector(i32) });
const _messagesArchivedStickers: any = () => ({ _: 'messages.archivedStickers', count: i32(), sets: vector(obj) });
const _messagesStickerSetInstallResultSuccess: any = () => ({ _: 'messages.stickerSetInstallResultSuccess' });
const _messagesStickerSetInstallResultArchive: any = () => ({ _: 'messages.stickerSetInstallResultArchive', sets: vector(obj) });
const _stickerSetCovered: any = () => ({ _: 'stickerSetCovered', set: obj(), cover: obj() });
const _stickerSetMultiCovered: any = () => ({ _: 'stickerSetMultiCovered', set: obj(), covers: vector(obj) });
const _maskCoords: any = () => ({ _: 'maskCoords', n: i32(), x: f64(), y: f64(), zoom: f64() });
const _inputStickeredMediaPhoto: any = () => ({ _: 'inputStickeredMediaPhoto', id: obj() });
const _inputStickeredMediaDocument: any = () => ({ _: 'inputStickeredMediaDocument', id: obj() });
const _game = (): any => {
  const result: Record<string, unknown> = { _: 'game' };
  const flags = i32();
  result.id = i64();
  result.access_hash = i64();
  result.short_name = str();
  result.title = str();
  result.description = str();
  result.photo = obj();
  if (flags & 0x1) result.document = obj();
  return result;
};
const _inputGameID: any = () => ({ _: 'inputGameID', id: i64(), access_hash: i64() });
const _inputGameShortName: any = () => ({ _: 'inputGameShortName', bot_id: obj(), short_name: str() });
const _highScore: any = () => ({ _: 'highScore', pos: i32(), user_id: i32(), score: i32() });
const _messagesHighScores: any = () => ({ _: 'messages.highScores', scores: vector(obj), users: vector(obj) });
const _textEmpty: any = () => ({ _: 'textEmpty' });
const _textPlain: any = () => ({ _: 'textPlain', text: str() });
const _textBold: any = () => ({ _: 'textBold', text: obj() });
const _textItalic: any = () => ({ _: 'textItalic', text: obj() });
const _textUnderline: any = () => ({ _: 'textUnderline', text: obj() });
const _textStrike: any = () => ({ _: 'textStrike', text: obj() });
const _textFixed: any = () => ({ _: 'textFixed', text: obj() });
const _textUrl: any = () => ({ _: 'textUrl', text: obj(), url: str(), webpage_id: i64() });
const _textEmail: any = () => ({ _: 'textEmail', text: obj(), email: str() });
const _textConcat: any = () => ({ _: 'textConcat', texts: vector(obj) });
const _textSubscript: any = () => ({ _: 'textSubscript', text: obj() });
const _textSuperscript: any = () => ({ _: 'textSuperscript', text: obj() });
const _textMarked: any = () => ({ _: 'textMarked', text: obj() });
const _textPhone: any = () => ({ _: 'textPhone', text: obj(), phone: str() });
const _textImage: any = () => ({ _: 'textImage', document_id: i64(), w: i32(), h: i32() });
const _textAnchor: any = () => ({ _: 'textAnchor', text: obj(), name: str() });
const _pageBlockUnsupported: any = () => ({ _: 'pageBlockUnsupported' });
const _pageBlockTitle: any = () => ({ _: 'pageBlockTitle', text: obj() });
const _pageBlockSubtitle: any = () => ({ _: 'pageBlockSubtitle', text: obj() });
const _pageBlockAuthorDate: any = () => ({ _: 'pageBlockAuthorDate', author: obj(), published_date: i32() });
const _pageBlockHeader: any = () => ({ _: 'pageBlockHeader', text: obj() });
const _pageBlockSubheader: any = () => ({ _: 'pageBlockSubheader', text: obj() });
const _pageBlockParagraph: any = () => ({ _: 'pageBlockParagraph', text: obj() });
const _pageBlockPreformatted: any = () => ({ _: 'pageBlockPreformatted', text: obj(), language: str() });
const _pageBlockFooter: any = () => ({ _: 'pageBlockFooter', text: obj() });
const _pageBlockDivider: any = () => ({ _: 'pageBlockDivider' });
const _pageBlockAnchor: any = () => ({ _: 'pageBlockAnchor', name: str() });
const _pageBlockList: any = () => ({ _: 'pageBlockList', items: vector(obj) });
const _pageBlockBlockquote: any = () => ({ _: 'pageBlockBlockquote', text: obj(), caption: obj() });
const _pageBlockPullquote: any = () => ({ _: 'pageBlockPullquote', text: obj(), caption: obj() });
const _pageBlockPhoto = (): any => {
  const result: Record<string, unknown> = { _: 'pageBlockPhoto' };
  const flags = i32();
  result.photo_id = i64();
  result.caption = obj();
  if (flags & 0x1) result.url = str();
  if (flags & 0x1) result.webpage_id = i64();
  return result;
};
const _pageBlockVideo = (): any => {
  const result: Record<string, unknown> = { _: 'pageBlockVideo' };
  const flags = i32();
  result.autoplay = !!(flags & 0x1);
  result.loop = !!(flags & 0x2);
  result.video_id = i64();
  result.caption = obj();
  return result;
};
const _pageBlockCover: any = () => ({ _: 'pageBlockCover', cover: obj() });
const _pageBlockEmbed = (): any => {
  const result: Record<string, unknown> = { _: 'pageBlockEmbed' };
  const flags = i32();
  result.full_width = !!(flags & 0x1);
  result.allow_scrolling = !!(flags & 0x8);
  if (flags & 0x2) result.url = str();
  if (flags & 0x4) result.html = str();
  if (flags & 0x10) result.poster_photo_id = i64();
  if (flags & 0x20) result.w = i32();
  if (flags & 0x20) result.h = i32();
  result.caption = obj();
  return result;
};
const _pageBlockEmbedPost: any = () => ({ _: 'pageBlockEmbedPost', url: str(), webpage_id: i64(), author_photo_id: i64(), author: str(), date: i32(), blocks: vector(obj), caption: obj() });
const _pageBlockCollage: any = () => ({ _: 'pageBlockCollage', items: vector(obj), caption: obj() });
const _pageBlockSlideshow: any = () => ({ _: 'pageBlockSlideshow', items: vector(obj), caption: obj() });
const _pageBlockChannel: any = () => ({ _: 'pageBlockChannel', channel: obj() });
const _pageBlockAudio: any = () => ({ _: 'pageBlockAudio', audio_id: i64(), caption: obj() });
const _pageBlockKicker: any = () => ({ _: 'pageBlockKicker', text: obj() });
const _pageBlockTable = (): any => {
  const result: Record<string, unknown> = { _: 'pageBlockTable' };
  const flags = i32();
  result.bordered = !!(flags & 0x1);
  result.striped = !!(flags & 0x2);
  result.title = obj();
  result.rows = vector(obj);
  return result;
};
const _pageBlockOrderedList: any = () => ({ _: 'pageBlockOrderedList', items: vector(obj) });
const _pageBlockDetails = (): any => {
  const result: Record<string, unknown> = { _: 'pageBlockDetails' };
  const flags = i32();
  result.open = !!(flags & 0x1);
  result.blocks = vector(obj);
  result.title = obj();
  return result;
};
const _pageBlockRelatedArticles: any = () => ({ _: 'pageBlockRelatedArticles', title: obj(), articles: vector(obj) });
const _pageBlockMap: any = () => ({ _: 'pageBlockMap', geo: obj(), zoom: i32(), w: i32(), h: i32(), caption: obj() });
const _phoneCallDiscardReasonMissed: any = () => ({ _: 'phoneCallDiscardReasonMissed' });
const _phoneCallDiscardReasonDisconnect: any = () => ({ _: 'phoneCallDiscardReasonDisconnect' });
const _phoneCallDiscardReasonHangup: any = () => ({ _: 'phoneCallDiscardReasonHangup' });
const _phoneCallDiscardReasonBusy: any = () => ({ _: 'phoneCallDiscardReasonBusy' });
const _dataJSON: any = () => ({ _: 'dataJSON', data: str() });
const _labeledPrice: any = () => ({ _: 'labeledPrice', label: str(), amount: i64() });
const _invoice = (): any => {
  const result: Record<string, unknown> = { _: 'invoice' };
  const flags = i32();
  result.test = !!(flags & 0x1);
  result.name_requested = !!(flags & 0x2);
  result.phone_requested = !!(flags & 0x4);
  result.email_requested = !!(flags & 0x8);
  result.shipping_address_requested = !!(flags & 0x10);
  result.flexible = !!(flags & 0x20);
  result.phone_to_provider = !!(flags & 0x40);
  result.email_to_provider = !!(flags & 0x80);
  result.currency = str();
  result.prices = vector(obj);
  return result;
};
const _paymentCharge: any = () => ({ _: 'paymentCharge', id: str(), provider_charge_id: str() });
const _postAddress: any = () => ({ _: 'postAddress', street_line1: str(), street_line2: str(), city: str(), state: str(), country_iso2: str(), post_code: str() });
const _paymentRequestedInfo = (): any => {
  const result: Record<string, unknown> = { _: 'paymentRequestedInfo' };
  const flags = i32();
  if (flags & 0x1) result.name = str();
  if (flags & 0x2) result.phone = str();
  if (flags & 0x4) result.email = str();
  if (flags & 0x8) result.shipping_address = obj();
  return result;
};
const _paymentSavedCredentialsCard: any = () => ({ _: 'paymentSavedCredentialsCard', id: str(), title: str() });
const _webDocument: any = () => ({ _: 'webDocument', url: str(), access_hash: i64(), size: i32(), mime_type: str(), attributes: vector(obj) });
const _webDocumentNoProxy: any = () => ({ _: 'webDocumentNoProxy', url: str(), size: i32(), mime_type: str(), attributes: vector(obj) });
const _inputWebDocument: any = () => ({ _: 'inputWebDocument', url: str(), size: i32(), mime_type: str(), attributes: vector(obj) });
const _inputWebFileLocation: any = () => ({ _: 'inputWebFileLocation', url: str(), access_hash: i64() });
const _inputWebFileGeoPointLocation: any = () => ({ _: 'inputWebFileGeoPointLocation', geo_point: obj(), access_hash: i64(), w: i32(), h: i32(), zoom: i32(), scale: i32() });
const _uploadWebFile: any = () => ({ _: 'upload.webFile', size: i32(), mime_type: str(), file_type: obj(), mtime: i32(), bytes: bytes() });
const _paymentsPaymentForm = (): any => {
  const result: Record<string, unknown> = { _: 'payments.paymentForm' };
  const flags = i32();
  result.can_save_credentials = !!(flags & 0x4);
  result.password_missing = !!(flags & 0x8);
  result.bot_id = i32();
  result.invoice = obj();
  result.provider_id = i32();
  result.url = str();
  if (flags & 0x10) result.native_provider = str();
  if (flags & 0x10) result.native_params = obj();
  if (flags & 0x1) result.saved_info = obj();
  if (flags & 0x2) result.saved_credentials = obj();
  result.users = vector(obj);
  return result;
};
const _paymentsValidatedRequestedInfo = (): any => {
  const result: Record<string, unknown> = { _: 'payments.validatedRequestedInfo' };
  const flags = i32();
  if (flags & 0x1) result.id = str();
  if (flags & 0x2) result.shipping_options = vector(obj);
  return result;
};
const _paymentsPaymentResult: any = () => ({ _: 'payments.paymentResult', updates: obj() });
const _paymentsPaymentVerificationNeeded: any = () => ({ _: 'payments.paymentVerificationNeeded', url: str() });
const _paymentsPaymentReceipt = (): any => {
  const result: Record<string, unknown> = { _: 'payments.paymentReceipt' };
  const flags = i32();
  result.date = i32();
  result.bot_id = i32();
  result.invoice = obj();
  result.provider_id = i32();
  if (flags & 0x1) result.info = obj();
  if (flags & 0x2) result.shipping = obj();
  result.currency = str();
  result.total_amount = i64();
  result.credentials_title = str();
  result.users = vector(obj);
  return result;
};
const _paymentsSavedInfo = (): any => {
  const result: Record<string, unknown> = { _: 'payments.savedInfo' };
  const flags = i32();
  result.has_saved_credentials = !!(flags & 0x2);
  if (flags & 0x1) result.saved_info = obj();
  return result;
};
const _inputPaymentCredentialsSaved: any = () => ({ _: 'inputPaymentCredentialsSaved', id: str(), tmp_password: bytes() });
const _inputPaymentCredentials = (): any => {
  const result: Record<string, unknown> = { _: 'inputPaymentCredentials' };
  const flags = i32();
  result.save = !!(flags & 0x1);
  result.data = obj();
  return result;
};
const _inputPaymentCredentialsApplePay: any = () => ({ _: 'inputPaymentCredentialsApplePay', payment_data: obj() });
const _inputPaymentCredentialsAndroidPay: any = () => ({ _: 'inputPaymentCredentialsAndroidPay', payment_token: obj(), google_transaction_id: str() });
const _accountTmpPassword: any = () => ({ _: 'account.tmpPassword', tmp_password: bytes(), valid_until: i32() });
const _shippingOption: any = () => ({ _: 'shippingOption', id: str(), title: str(), prices: vector(obj) });
const _inputStickerSetItem = (): any => {
  const result: Record<string, unknown> = { _: 'inputStickerSetItem' };
  const flags = i32();
  result.document = obj();
  result.emoji = str();
  if (flags & 0x1) result.mask_coords = obj();
  return result;
};
const _inputPhoneCall: any = () => ({ _: 'inputPhoneCall', id: i64(), access_hash: i64() });
const _phoneCallEmpty: any = () => ({ _: 'phoneCallEmpty', id: i64() });
const _phoneCallWaiting = (): any => {
  const result: Record<string, unknown> = { _: 'phoneCallWaiting' };
  const flags = i32();
  result.video = !!(flags & 0x20);
  result.id = i64();
  result.access_hash = i64();
  result.date = i32();
  result.admin_id = i32();
  result.participant_id = i32();
  result.protocol = obj();
  if (flags & 0x1) result.receive_date = i32();
  return result;
};
const _phoneCallRequested = (): any => {
  const result: Record<string, unknown> = { _: 'phoneCallRequested' };
  const flags = i32();
  result.video = !!(flags & 0x20);
  result.id = i64();
  result.access_hash = i64();
  result.date = i32();
  result.admin_id = i32();
  result.participant_id = i32();
  result.g_a_hash = bytes();
  result.protocol = obj();
  return result;
};
const _phoneCallAccepted = (): any => {
  const result: Record<string, unknown> = { _: 'phoneCallAccepted' };
  const flags = i32();
  result.video = !!(flags & 0x20);
  result.id = i64();
  result.access_hash = i64();
  result.date = i32();
  result.admin_id = i32();
  result.participant_id = i32();
  result.g_b = bytes();
  result.protocol = obj();
  return result;
};
const _phoneCall = (): any => {
  const result: Record<string, unknown> = { _: 'phoneCall' };
  const flags = i32();
  result.p2p_allowed = !!(flags & 0x20);
  result.id = i64();
  result.access_hash = i64();
  result.date = i32();
  result.admin_id = i32();
  result.participant_id = i32();
  result.g_a_or_b = bytes();
  result.key_fingerprint = i64();
  result.protocol = obj();
  result.connections = vector(obj);
  result.start_date = i32();
  return result;
};
const _phoneCallDiscarded = (): any => {
  const result: Record<string, unknown> = { _: 'phoneCallDiscarded' };
  const flags = i32();
  result.need_rating = !!(flags & 0x4);
  result.need_debug = !!(flags & 0x8);
  result.video = !!(flags & 0x20);
  result.id = i64();
  if (flags & 0x1) result.reason = obj();
  if (flags & 0x2) result.duration = i32();
  return result;
};
const _phoneConnection: any = () => ({ _: 'phoneConnection', id: i64(), ip: str(), ipv6: str(), port: i32(), peer_tag: bytes() });
const _phoneCallProtocol = (): any => {
  const result: Record<string, unknown> = { _: 'phoneCallProtocol' };
  const flags = i32();
  result.udp_p2p = !!(flags & 0x1);
  result.udp_reflector = !!(flags & 0x2);
  result.min_layer = i32();
  result.max_layer = i32();
  result.library_versions = vector(str);
  return result;
};
const _phonePhoneCall: any = () => ({ _: 'phone.phoneCall', phone_call: obj(), users: vector(obj) });
const _uploadCdnFileReuploadNeeded: any = () => ({ _: 'upload.cdnFileReuploadNeeded', request_token: bytes() });
const _uploadCdnFile: any = () => ({ _: 'upload.cdnFile', bytes: bytes() });
const _cdnPublicKey: any = () => ({ _: 'cdnPublicKey', dc_id: i32(), public_key: str() });
const _cdnConfig: any = () => ({ _: 'cdnConfig', public_keys: vector(obj) });
const _langPackString: any = () => ({ _: 'langPackString', key: str(), value: str() });
const _langPackStringPluralized = (): any => {
  const result: Record<string, unknown> = { _: 'langPackStringPluralized' };
  const flags = i32();
  result.key = str();
  if (flags & 0x1) result.zero_value = str();
  if (flags & 0x2) result.one_value = str();
  if (flags & 0x4) result.two_value = str();
  if (flags & 0x8) result.few_value = str();
  if (flags & 0x10) result.many_value = str();
  result.other_value = str();
  return result;
};
const _langPackStringDeleted: any = () => ({ _: 'langPackStringDeleted', key: str() });
const _langPackDifference: any = () => ({ _: 'langPackDifference', lang_code: str(), from_version: i32(), version: i32(), strings: vector(obj) });
const _langPackLanguage = (): any => {
  const result: Record<string, unknown> = { _: 'langPackLanguage' };
  const flags = i32();
  result.official = !!(flags & 0x1);
  result.rtl = !!(flags & 0x4);
  result.beta = !!(flags & 0x8);
  result.name = str();
  result.native_name = str();
  result.lang_code = str();
  if (flags & 0x2) result.base_lang_code = str();
  result.plural_code = str();
  result.strings_count = i32();
  result.translated_count = i32();
  result.translations_url = str();
  return result;
};
const _channelAdminLogEventActionChangeTitle: any = () => ({ _: 'channelAdminLogEventActionChangeTitle', prev_value: str(), new_value: str() });
const _channelAdminLogEventActionChangeAbout: any = () => ({ _: 'channelAdminLogEventActionChangeAbout', prev_value: str(), new_value: str() });
const _channelAdminLogEventActionChangeUsername: any = () => ({ _: 'channelAdminLogEventActionChangeUsername', prev_value: str(), new_value: str() });
const _channelAdminLogEventActionChangePhoto: any = () => ({ _: 'channelAdminLogEventActionChangePhoto', prev_photo: obj(), new_photo: obj() });
const _channelAdminLogEventActionToggleInvites: any = () => ({ _: 'channelAdminLogEventActionToggleInvites', new_value: obj() });
const _channelAdminLogEventActionToggleSignatures: any = () => ({ _: 'channelAdminLogEventActionToggleSignatures', new_value: obj() });
const _channelAdminLogEventActionUpdatePinned: any = () => ({ _: 'channelAdminLogEventActionUpdatePinned', message: obj() });
const _channelAdminLogEventActionEditMessage: any = () => ({ _: 'channelAdminLogEventActionEditMessage', prev_message: obj(), new_message: obj() });
const _channelAdminLogEventActionDeleteMessage: any = () => ({ _: 'channelAdminLogEventActionDeleteMessage', message: obj() });
const _channelAdminLogEventActionParticipantJoin: any = () => ({ _: 'channelAdminLogEventActionParticipantJoin' });
const _channelAdminLogEventActionParticipantLeave: any = () => ({ _: 'channelAdminLogEventActionParticipantLeave' });
const _channelAdminLogEventActionParticipantInvite: any = () => ({ _: 'channelAdminLogEventActionParticipantInvite', participant: obj() });
const _channelAdminLogEventActionParticipantToggleBan: any = () => ({ _: 'channelAdminLogEventActionParticipantToggleBan', prev_participant: obj(), new_participant: obj() });
const _channelAdminLogEventActionParticipantToggleAdmin: any = () => ({ _: 'channelAdminLogEventActionParticipantToggleAdmin', prev_participant: obj(), new_participant: obj() });
const _channelAdminLogEventActionChangeStickerSet: any = () => ({ _: 'channelAdminLogEventActionChangeStickerSet', prev_stickerset: obj(), new_stickerset: obj() });
const _channelAdminLogEventActionTogglePreHistoryHidden: any = () => ({ _: 'channelAdminLogEventActionTogglePreHistoryHidden', new_value: obj() });
const _channelAdminLogEventActionDefaultBannedRights: any = () => ({ _: 'channelAdminLogEventActionDefaultBannedRights', prev_banned_rights: obj(), new_banned_rights: obj() });
const _channelAdminLogEventActionStopPoll: any = () => ({ _: 'channelAdminLogEventActionStopPoll', message: obj() });
const _channelAdminLogEventActionChangeLinkedChat: any = () => ({ _: 'channelAdminLogEventActionChangeLinkedChat', prev_value: i32(), new_value: i32() });
const _channelAdminLogEventActionChangeLocation: any = () => ({ _: 'channelAdminLogEventActionChangeLocation', prev_value: obj(), new_value: obj() });
const _channelAdminLogEventActionToggleSlowMode: any = () => ({ _: 'channelAdminLogEventActionToggleSlowMode', prev_value: i32(), new_value: i32() });
const _channelAdminLogEvent: any = () => ({ _: 'channelAdminLogEvent', id: i64(), date: i32(), user_id: i32(), action: obj() });
const _channelsAdminLogResults: any = () => ({ _: 'channels.adminLogResults', events: vector(obj), chats: vector(obj), users: vector(obj) });
const _channelAdminLogEventsFilter = (): any => {
  const result: Record<string, unknown> = { _: 'channelAdminLogEventsFilter' };
  const flags = i32();
  result.join = !!(flags & 0x1);
  result.leave = !!(flags & 0x2);
  result.invite = !!(flags & 0x4);
  result.ban = !!(flags & 0x8);
  result.unban = !!(flags & 0x10);
  result.kick = !!(flags & 0x20);
  result.unkick = !!(flags & 0x40);
  result.promote = !!(flags & 0x80);
  result.demote = !!(flags & 0x100);
  result.info = !!(flags & 0x200);
  result.settings = !!(flags & 0x400);
  result.pinned = !!(flags & 0x800);
  result.edit = !!(flags & 0x1000);
  result.delete = !!(flags & 0x2000);
  return result;
};
const _popularContact: any = () => ({ _: 'popularContact', client_id: i64(), importers: i32() });
const _messagesFavedStickersNotModified: any = () => ({ _: 'messages.favedStickersNotModified' });
const _messagesFavedStickers: any = () => ({ _: 'messages.favedStickers', hash: i32(), packs: vector(obj), stickers: vector(obj) });
const _recentMeUrlUnknown: any = () => ({ _: 'recentMeUrlUnknown', url: str() });
const _recentMeUrlUser: any = () => ({ _: 'recentMeUrlUser', url: str(), user_id: i32() });
const _recentMeUrlChat: any = () => ({ _: 'recentMeUrlChat', url: str(), chat_id: i32() });
const _recentMeUrlChatInvite: any = () => ({ _: 'recentMeUrlChatInvite', url: str(), chat_invite: obj() });
const _recentMeUrlStickerSet: any = () => ({ _: 'recentMeUrlStickerSet', url: str(), set: obj() });
const _helpRecentMeUrls: any = () => ({ _: 'help.recentMeUrls', urls: vector(obj), chats: vector(obj), users: vector(obj) });
const _inputSingleMedia = (): any => {
  const result: Record<string, unknown> = { _: 'inputSingleMedia' };
  const flags = i32();
  result.media = obj();
  result.random_id = i64();
  result.message = str();
  if (flags & 0x1) result.entities = vector(obj);
  return result;
};
const _webAuthorization: any = () => ({ _: 'webAuthorization', hash: i64(), bot_id: i32(), domain: str(), browser: str(), platform: str(), date_created: i32(), date_active: i32(), ip: str(), region: str() });
const _accountWebAuthorizations: any = () => ({ _: 'account.webAuthorizations', authorizations: vector(obj), users: vector(obj) });
const _inputMessageID: any = () => ({ _: 'inputMessageID', id: i32() });
const _inputMessageReplyTo: any = () => ({ _: 'inputMessageReplyTo', id: i32() });
const _inputMessagePinned: any = () => ({ _: 'inputMessagePinned' });
const _inputDialogPeer: any = () => ({ _: 'inputDialogPeer', peer: obj() });
const _inputDialogPeerFolder: any = () => ({ _: 'inputDialogPeerFolder', folder_id: i32() });
const _dialogPeer: any = () => ({ _: 'dialogPeer', peer: obj() });
const _dialogPeerFolder: any = () => ({ _: 'dialogPeerFolder', folder_id: i32() });
const _messagesFoundStickerSetsNotModified: any = () => ({ _: 'messages.foundStickerSetsNotModified' });
const _messagesFoundStickerSets: any = () => ({ _: 'messages.foundStickerSets', hash: i32(), sets: vector(obj) });
const _fileHash: any = () => ({ _: 'fileHash', offset: i32(), limit: i32(), hash: bytes() });
const _inputClientProxy: any = () => ({ _: 'inputClientProxy', address: str(), port: i32() });
const _helpTermsOfServiceUpdateEmpty: any = () => ({ _: 'help.termsOfServiceUpdateEmpty', expires: i32() });
const _helpTermsOfServiceUpdate: any = () => ({ _: 'help.termsOfServiceUpdate', expires: i32(), terms_of_service: obj() });
const _inputSecureFileUploaded: any = () => ({ _: 'inputSecureFileUploaded', id: i64(), parts: i32(), md5_checksum: str(), file_hash: bytes(), secret: bytes() });
const _inputSecureFile: any = () => ({ _: 'inputSecureFile', id: i64(), access_hash: i64() });
const _secureFileEmpty: any = () => ({ _: 'secureFileEmpty' });
const _secureFile: any = () => ({ _: 'secureFile', id: i64(), access_hash: i64(), size: i32(), dc_id: i32(), date: i32(), file_hash: bytes(), secret: bytes() });
const _secureData: any = () => ({ _: 'secureData', data: bytes(), data_hash: bytes(), secret: bytes() });
const _securePlainPhone: any = () => ({ _: 'securePlainPhone', phone: str() });
const _securePlainEmail: any = () => ({ _: 'securePlainEmail', email: str() });
const _secureValueTypePersonalDetails: any = () => ({ _: 'secureValueTypePersonalDetails' });
const _secureValueTypePassport: any = () => ({ _: 'secureValueTypePassport' });
const _secureValueTypeDriverLicense: any = () => ({ _: 'secureValueTypeDriverLicense' });
const _secureValueTypeIdentityCard: any = () => ({ _: 'secureValueTypeIdentityCard' });
const _secureValueTypeInternalPassport: any = () => ({ _: 'secureValueTypeInternalPassport' });
const _secureValueTypeAddress: any = () => ({ _: 'secureValueTypeAddress' });
const _secureValueTypeUtilityBill: any = () => ({ _: 'secureValueTypeUtilityBill' });
const _secureValueTypeBankStatement: any = () => ({ _: 'secureValueTypeBankStatement' });
const _secureValueTypeRentalAgreement: any = () => ({ _: 'secureValueTypeRentalAgreement' });
const _secureValueTypePassportRegistration: any = () => ({ _: 'secureValueTypePassportRegistration' });
const _secureValueTypeTemporaryRegistration: any = () => ({ _: 'secureValueTypeTemporaryRegistration' });
const _secureValueTypePhone: any = () => ({ _: 'secureValueTypePhone' });
const _secureValueTypeEmail: any = () => ({ _: 'secureValueTypeEmail' });
const _secureValue = (): any => {
  const result: Record<string, unknown> = { _: 'secureValue' };
  const flags = i32();
  result.type = obj();
  if (flags & 0x1) result.data = obj();
  if (flags & 0x2) result.front_side = obj();
  if (flags & 0x4) result.reverse_side = obj();
  if (flags & 0x8) result.selfie = obj();
  if (flags & 0x40) result.translation = vector(obj);
  if (flags & 0x10) result.files = vector(obj);
  if (flags & 0x20) result.plain_data = obj();
  result.hash = bytes();
  return result;
};
const _inputSecureValue = (): any => {
  const result: Record<string, unknown> = { _: 'inputSecureValue' };
  const flags = i32();
  result.type = obj();
  if (flags & 0x1) result.data = obj();
  if (flags & 0x2) result.front_side = obj();
  if (flags & 0x4) result.reverse_side = obj();
  if (flags & 0x8) result.selfie = obj();
  if (flags & 0x40) result.translation = vector(obj);
  if (flags & 0x10) result.files = vector(obj);
  if (flags & 0x20) result.plain_data = obj();
  return result;
};
const _secureValueHash: any = () => ({ _: 'secureValueHash', type: obj(), hash: bytes() });
const _secureValueErrorData: any = () => ({ _: 'secureValueErrorData', type: obj(), data_hash: bytes(), field: str(), text: str() });
const _secureValueErrorFrontSide: any = () => ({ _: 'secureValueErrorFrontSide', type: obj(), file_hash: bytes(), text: str() });
const _secureValueErrorReverseSide: any = () => ({ _: 'secureValueErrorReverseSide', type: obj(), file_hash: bytes(), text: str() });
const _secureValueErrorSelfie: any = () => ({ _: 'secureValueErrorSelfie', type: obj(), file_hash: bytes(), text: str() });
const _secureValueErrorFile: any = () => ({ _: 'secureValueErrorFile', type: obj(), file_hash: bytes(), text: str() });
const _secureValueErrorFiles: any = () => ({ _: 'secureValueErrorFiles', type: obj(), file_hash: vector(bytes), text: str() });
const _secureValueError: any = () => ({ _: 'secureValueError', type: obj(), hash: bytes(), text: str() });
const _secureValueErrorTranslationFile: any = () => ({ _: 'secureValueErrorTranslationFile', type: obj(), file_hash: bytes(), text: str() });
const _secureValueErrorTranslationFiles: any = () => ({ _: 'secureValueErrorTranslationFiles', type: obj(), file_hash: vector(bytes), text: str() });
const _secureCredentialsEncrypted: any = () => ({ _: 'secureCredentialsEncrypted', data: bytes(), hash: bytes(), secret: bytes() });
const _accountAuthorizationForm = (): any => {
  const result: Record<string, unknown> = { _: 'account.authorizationForm' };
  const flags = i32();
  result.required_types = vector(obj);
  result.values = vector(obj);
  result.errors = vector(obj);
  result.users = vector(obj);
  if (flags & 0x1) result.privacy_policy_url = str();
  return result;
};
const _accountSentEmailCode: any = () => ({ _: 'account.sentEmailCode', email_pattern: str(), length: i32() });
const _helpDeepLinkInfoEmpty: any = () => ({ _: 'help.deepLinkInfoEmpty' });
const _helpDeepLinkInfo = (): any => {
  const result: Record<string, unknown> = { _: 'help.deepLinkInfo' };
  const flags = i32();
  result.update_app = !!(flags & 0x1);
  result.message = str();
  if (flags & 0x2) result.entities = vector(obj);
  return result;
};
const _savedPhoneContact: any = () => ({ _: 'savedPhoneContact', phone: str(), first_name: str(), last_name: str(), date: i32() });
const _accountTakeout: any = () => ({ _: 'account.takeout', id: i64() });
const _passwordKdfAlgoUnknown: any = () => ({ _: 'passwordKdfAlgoUnknown' });
const _passwordKdfAlgoSHA256SHA256PBKDF2HMACSHA512iter100000SHA256ModPow: any = () => ({ _: 'passwordKdfAlgoSHA256SHA256PBKDF2HMACSHA512iter100000SHA256ModPow', salt1: bytes(), salt2: bytes(), g: i32(), p: bytes() });
const _securePasswordKdfAlgoUnknown: any = () => ({ _: 'securePasswordKdfAlgoUnknown' });
const _securePasswordKdfAlgoPBKDF2HMACSHA512iter100000: any = () => ({ _: 'securePasswordKdfAlgoPBKDF2HMACSHA512iter100000', salt: bytes() });
const _securePasswordKdfAlgoSHA512: any = () => ({ _: 'securePasswordKdfAlgoSHA512', salt: bytes() });
const _secureSecretSettings: any = () => ({ _: 'secureSecretSettings', secure_algo: obj(), secure_secret: bytes(), secure_secret_id: i64() });
const _inputCheckPasswordEmpty: any = () => ({ _: 'inputCheckPasswordEmpty' });
const _inputCheckPasswordSRP: any = () => ({ _: 'inputCheckPasswordSRP', srp_id: i64(), A: bytes(), M1: bytes() });
const _secureRequiredType = (): any => {
  const result: Record<string, unknown> = { _: 'secureRequiredType' };
  const flags = i32();
  result.native_names = !!(flags & 0x1);
  result.selfie_required = !!(flags & 0x2);
  result.translation_required = !!(flags & 0x4);
  result.type = obj();
  return result;
};
const _secureRequiredTypeOneOf: any = () => ({ _: 'secureRequiredTypeOneOf', types: vector(obj) });
const _helpPassportConfigNotModified: any = () => ({ _: 'help.passportConfigNotModified' });
const _helpPassportConfig: any = () => ({ _: 'help.passportConfig', hash: i32(), countries_langs: obj() });
const _inputAppEvent: any = () => ({ _: 'inputAppEvent', time: f64(), type: str(), peer: i64(), data: obj() });
const _jsonObjectValue: any = () => ({ _: 'jsonObjectValue', key: str(), value: obj() });
const _jsonNull: any = () => ({ _: 'jsonNull' });
const _jsonBool: any = () => ({ _: 'jsonBool', value: obj() });
const _jsonNumber: any = () => ({ _: 'jsonNumber', value: f64() });
const _jsonString: any = () => ({ _: 'jsonString', value: str() });
const _jsonArray: any = () => ({ _: 'jsonArray', value: vector(obj) });
const _jsonObject: any = () => ({ _: 'jsonObject', value: vector(obj) });
const _pageTableCell = (): any => {
  const result: Record<string, unknown> = { _: 'pageTableCell' };
  const flags = i32();
  result.header = !!(flags & 0x1);
  result.align_center = !!(flags & 0x8);
  result.align_right = !!(flags & 0x10);
  result.valign_middle = !!(flags & 0x20);
  result.valign_bottom = !!(flags & 0x40);
  if (flags & 0x80) result.text = obj();
  if (flags & 0x2) result.colspan = i32();
  if (flags & 0x4) result.rowspan = i32();
  return result;
};
const _pageTableRow: any = () => ({ _: 'pageTableRow', cells: vector(obj) });
const _pageCaption: any = () => ({ _: 'pageCaption', text: obj(), credit: obj() });
const _pageListItemText: any = () => ({ _: 'pageListItemText', text: obj() });
const _pageListItemBlocks: any = () => ({ _: 'pageListItemBlocks', blocks: vector(obj) });
const _pageListOrderedItemText: any = () => ({ _: 'pageListOrderedItemText', num: str(), text: obj() });
const _pageListOrderedItemBlocks: any = () => ({ _: 'pageListOrderedItemBlocks', num: str(), blocks: vector(obj) });
const _pageRelatedArticle = (): any => {
  const result: Record<string, unknown> = { _: 'pageRelatedArticle' };
  const flags = i32();
  result.url = str();
  result.webpage_id = i64();
  if (flags & 0x1) result.title = str();
  if (flags & 0x2) result.description = str();
  if (flags & 0x4) result.photo_id = i64();
  if (flags & 0x8) result.author = str();
  if (flags & 0x10) result.published_date = i32();
  return result;
};
const _page = (): any => {
  const result: Record<string, unknown> = { _: 'page' };
  const flags = i32();
  result.part = !!(flags & 0x1);
  result.rtl = !!(flags & 0x2);
  result.v2 = !!(flags & 0x4);
  result.url = str();
  result.blocks = vector(obj);
  result.photos = vector(obj);
  result.documents = vector(obj);
  if (flags & 0x8) result.views = i32();
  return result;
};
const _helpSupportName: any = () => ({ _: 'help.supportName', name: str() });
const _helpUserInfoEmpty: any = () => ({ _: 'help.userInfoEmpty' });
const _helpUserInfo: any = () => ({ _: 'help.userInfo', message: str(), entities: vector(obj), author: str(), date: i32() });
const _pollAnswer: any = () => ({ _: 'pollAnswer', text: str(), option: bytes() });
const _poll = (): any => {
  const result: Record<string, unknown> = { _: 'poll' };
  result.id = i64();
  const flags = i32();
  result.closed = !!(flags & 0x1);
  result.public_voters = !!(flags & 0x2);
  result.multiple_choice = !!(flags & 0x4);
  result.quiz = !!(flags & 0x8);
  result.question = str();
  result.answers = vector(obj);
  if (flags & 0x10) result.close_period = i32();
  if (flags & 0x20) result.close_date = i32();
  return result;
};
const _pollAnswerVoters = (): any => {
  const result: Record<string, unknown> = { _: 'pollAnswerVoters' };
  const flags = i32();
  result.chosen = !!(flags & 0x1);
  result.correct = !!(flags & 0x2);
  result.option = bytes();
  result.voters = i32();
  return result;
};
const _pollResults = (): any => {
  const result: Record<string, unknown> = { _: 'pollResults' };
  const flags = i32();
  result.min = !!(flags & 0x1);
  if (flags & 0x2) result.results = vector(obj);
  if (flags & 0x4) result.total_voters = i32();
  if (flags & 0x8) result.recent_voters = vector(i32);
  if (flags & 0x10) result.solution = str();
  if (flags & 0x10) result.solution_entities = vector(obj);
  return result;
};
const _chatOnlines: any = () => ({ _: 'chatOnlines', onlines: i32() });
const _statsURL: any = () => ({ _: 'statsURL', url: str() });
const _chatAdminRights = (): any => {
  const result: Record<string, unknown> = { _: 'chatAdminRights' };
  const flags = i32();
  result.change_info = !!(flags & 0x1);
  result.post_messages = !!(flags & 0x2);
  result.edit_messages = !!(flags & 0x4);
  result.delete_messages = !!(flags & 0x8);
  result.ban_users = !!(flags & 0x10);
  result.invite_users = !!(flags & 0x20);
  result.pin_messages = !!(flags & 0x80);
  result.add_admins = !!(flags & 0x200);
  return result;
};
const _chatBannedRights = (): any => {
  const result: Record<string, unknown> = { _: 'chatBannedRights' };
  const flags = i32();
  result.view_messages = !!(flags & 0x1);
  result.send_messages = !!(flags & 0x2);
  result.send_media = !!(flags & 0x4);
  result.send_stickers = !!(flags & 0x8);
  result.send_gifs = !!(flags & 0x10);
  result.send_games = !!(flags & 0x20);
  result.send_inline = !!(flags & 0x40);
  result.embed_links = !!(flags & 0x80);
  result.send_polls = !!(flags & 0x100);
  result.change_info = !!(flags & 0x400);
  result.invite_users = !!(flags & 0x8000);
  result.pin_messages = !!(flags & 0x20000);
  result.until_date = i32();
  return result;
};
const _inputWallPaper: any = () => ({ _: 'inputWallPaper', id: i64(), access_hash: i64() });
const _inputWallPaperSlug: any = () => ({ _: 'inputWallPaperSlug', slug: str() });
const _inputWallPaperNoFile: any = () => ({ _: 'inputWallPaperNoFile' });
const _accountWallPapersNotModified: any = () => ({ _: 'account.wallPapersNotModified' });
const _accountWallPapers: any = () => ({ _: 'account.wallPapers', hash: i32(), wallpapers: vector(obj) });
const _codeSettings = (): any => {
  const result: Record<string, unknown> = { _: 'codeSettings' };
  const flags = i32();
  result.allow_flashcall = !!(flags & 0x1);
  result.current_number = !!(flags & 0x2);
  result.allow_app_hash = !!(flags & 0x10);
  return result;
};
const _wallPaperSettings = (): any => {
  const result: Record<string, unknown> = { _: 'wallPaperSettings' };
  const flags = i32();
  result.blur = !!(flags & 0x2);
  result.motion = !!(flags & 0x4);
  if (flags & 0x1) result.background_color = i32();
  if (flags & 0x10) result.second_background_color = i32();
  if (flags & 0x8) result.intensity = i32();
  if (flags & 0x10) result.rotation = i32();
  return result;
};
const _autoDownloadSettings = (): any => {
  const result: Record<string, unknown> = { _: 'autoDownloadSettings' };
  const flags = i32();
  result.disabled = !!(flags & 0x1);
  result.video_preload_large = !!(flags & 0x2);
  result.audio_preload_next = !!(flags & 0x4);
  result.phonecalls_less_data = !!(flags & 0x8);
  result.photo_size_max = i32();
  result.video_size_max = i32();
  result.file_size_max = i32();
  result.video_upload_maxbitrate = i32();
  return result;
};
const _accountAutoDownloadSettings: any = () => ({ _: 'account.autoDownloadSettings', low: obj(), medium: obj(), high: obj() });
const _emojiKeyword: any = () => ({ _: 'emojiKeyword', keyword: str(), emoticons: vector(str) });
const _emojiKeywordDeleted: any = () => ({ _: 'emojiKeywordDeleted', keyword: str(), emoticons: vector(str) });
const _emojiKeywordsDifference: any = () => ({ _: 'emojiKeywordsDifference', lang_code: str(), from_version: i32(), version: i32(), keywords: vector(obj) });
const _emojiURL: any = () => ({ _: 'emojiURL', url: str() });
const _emojiLanguage: any = () => ({ _: 'emojiLanguage', lang_code: str() });
const _fileLocationToBeDeprecated: any = () => ({ _: 'fileLocationToBeDeprecated', volume_id: i64(), local_id: i32() });
const _folder = (): any => {
  const result: Record<string, unknown> = { _: 'folder' };
  const flags = i32();
  result.autofill_new_broadcasts = !!(flags & 0x1);
  result.autofill_public_groups = !!(flags & 0x2);
  result.autofill_new_correspondents = !!(flags & 0x4);
  result.id = i32();
  result.title = str();
  if (flags & 0x8) result.photo = obj();
  return result;
};
const _inputFolderPeer: any = () => ({ _: 'inputFolderPeer', peer: obj(), folder_id: i32() });
const _folderPeer: any = () => ({ _: 'folderPeer', peer: obj(), folder_id: i32() });
const _messagesSearchCounter = (): any => {
  const result: Record<string, unknown> = { _: 'messages.searchCounter' };
  const flags = i32();
  result.inexact = !!(flags & 0x2);
  result.filter = obj();
  result.count = i32();
  return result;
};
const _urlAuthResultRequest = (): any => {
  const result: Record<string, unknown> = { _: 'urlAuthResultRequest' };
  const flags = i32();
  result.request_write_access = !!(flags & 0x1);
  result.bot = obj();
  result.domain = str();
  return result;
};
const _urlAuthResultAccepted: any = () => ({ _: 'urlAuthResultAccepted', url: str() });
const _urlAuthResultDefault: any = () => ({ _: 'urlAuthResultDefault' });
const _channelLocationEmpty: any = () => ({ _: 'channelLocationEmpty' });
const _channelLocation: any = () => ({ _: 'channelLocation', geo_point: obj(), address: str() });
const _peerLocated: any = () => ({ _: 'peerLocated', peer: obj(), expires: i32(), distance: i32() });
const _peerSelfLocated: any = () => ({ _: 'peerSelfLocated', expires: i32() });
const _restrictionReason: any = () => ({ _: 'restrictionReason', platform: str(), reason: str(), text: str() });
const _inputTheme: any = () => ({ _: 'inputTheme', id: i64(), access_hash: i64() });
const _inputThemeSlug: any = () => ({ _: 'inputThemeSlug', slug: str() });
const _theme = (): any => {
  const result: Record<string, unknown> = { _: 'theme' };
  const flags = i32();
  result.creator = !!(flags & 0x1);
  result.default = !!(flags & 0x2);
  result.id = i64();
  result.access_hash = i64();
  result.slug = str();
  result.title = str();
  if (flags & 0x4) result.document = obj();
  if (flags & 0x8) result.settings = obj();
  result.installs_count = i32();
  return result;
};
const _accountThemesNotModified: any = () => ({ _: 'account.themesNotModified' });
const _accountThemes: any = () => ({ _: 'account.themes', hash: i32(), themes: vector(obj) });
const _authLoginToken: any = () => ({ _: 'auth.loginToken', expires: i32(), token: bytes() });
const _authLoginTokenMigrateTo: any = () => ({ _: 'auth.loginTokenMigrateTo', dc_id: i32(), token: bytes() });
const _authLoginTokenSuccess: any = () => ({ _: 'auth.loginTokenSuccess', authorization: obj() });
const _accountContentSettings = (): any => {
  const result: Record<string, unknown> = { _: 'account.contentSettings' };
  const flags = i32();
  result.sensitive_enabled = !!(flags & 0x1);
  result.sensitive_can_change = !!(flags & 0x2);
  return result;
};
const _messagesInactiveChats: any = () => ({ _: 'messages.inactiveChats', dates: vector(i32), chats: vector(obj), users: vector(obj) });
const _baseThemeClassic: any = () => ({ _: 'baseThemeClassic' });
const _baseThemeDay: any = () => ({ _: 'baseThemeDay' });
const _baseThemeNight: any = () => ({ _: 'baseThemeNight' });
const _baseThemeTinted: any = () => ({ _: 'baseThemeTinted' });
const _baseThemeArctic: any = () => ({ _: 'baseThemeArctic' });
const _inputThemeSettings = (): any => {
  const result: Record<string, unknown> = { _: 'inputThemeSettings' };
  const flags = i32();
  result.base_theme = obj();
  result.accent_color = i32();
  if (flags & 0x1) result.message_top_color = i32();
  if (flags & 0x1) result.message_bottom_color = i32();
  if (flags & 0x2) result.wallpaper = obj();
  if (flags & 0x2) result.wallpaper_settings = obj();
  return result;
};
const _themeSettings = (): any => {
  const result: Record<string, unknown> = { _: 'themeSettings' };
  const flags = i32();
  result.base_theme = obj();
  result.accent_color = i32();
  if (flags & 0x1) result.message_top_color = i32();
  if (flags & 0x1) result.message_bottom_color = i32();
  if (flags & 0x2) result.wallpaper = obj();
  return result;
};
const _webPageAttributeTheme = (): any => {
  const result: Record<string, unknown> = { _: 'webPageAttributeTheme' };
  const flags = i32();
  if (flags & 0x1) result.documents = vector(obj);
  if (flags & 0x2) result.settings = obj();
  return result;
};
const _messageUserVote: any = () => ({ _: 'messageUserVote', user_id: i32(), option: bytes(), date: i32() });
const _messageUserVoteInputOption: any = () => ({ _: 'messageUserVoteInputOption', user_id: i32(), date: i32() });
const _messageUserVoteMultiple: any = () => ({ _: 'messageUserVoteMultiple', user_id: i32(), options: vector(bytes), date: i32() });
const _messagesVotesList = (): any => {
  const result: Record<string, unknown> = { _: 'messages.votesList' };
  const flags = i32();
  result.count = i32();
  result.votes = vector(obj);
  result.users = vector(obj);
  if (flags & 0x1) result.next_offset = str();
  return result;
};
const _bankCardOpenUrl: any = () => ({ _: 'bankCardOpenUrl', url: str(), name: str() });
const _paymentsBankCardData: any = () => ({ _: 'payments.bankCardData', title: str(), open_urls: vector(obj) });
const _dialogFilter = (): any => {
  const result: Record<string, unknown> = { _: 'dialogFilter' };
  const flags = i32();
  result.contacts = !!(flags & 0x1);
  result.non_contacts = !!(flags & 0x2);
  result.groups = !!(flags & 0x4);
  result.broadcasts = !!(flags & 0x8);
  result.bots = !!(flags & 0x10);
  result.exclude_muted = !!(flags & 0x800);
  result.exclude_read = !!(flags & 0x1000);
  result.exclude_archived = !!(flags & 0x2000);
  result.id = i32();
  result.title = str();
  if (flags & 0x2000000) result.emoticon = str();
  result.pinned_peers = vector(obj);
  result.include_peers = vector(obj);
  result.exclude_peers = vector(obj);
  return result;
};
const _dialogFilterSuggested: any = () => ({ _: 'dialogFilterSuggested', filter: obj(), description: str() });
const _statsDateRangeDays: any = () => ({ _: 'statsDateRangeDays', min_date: i32(), max_date: i32() });
const _statsAbsValueAndPrev: any = () => ({ _: 'statsAbsValueAndPrev', current: f64(), previous: f64() });
const _statsPercentValue: any = () => ({ _: 'statsPercentValue', part: f64(), total: f64() });
const _statsGraphAsync: any = () => ({ _: 'statsGraphAsync', token: str() });
const _statsGraphError: any = () => ({ _: 'statsGraphError', error: str() });
const _statsGraph = (): any => {
  const result: Record<string, unknown> = { _: 'statsGraph' };
  const flags = i32();
  result.json = obj();
  if (flags & 0x1) result.zoom_token = str();
  return result;
};
const _messageInteractionCounters: any = () => ({ _: 'messageInteractionCounters', msg_id: i32(), views: i32(), forwards: i32() });
const _statsBroadcastStats: any = () => ({ _: 'stats.broadcastStats', period: obj(), followers: obj(), views_per_post: obj(), shares_per_post: obj(), enabled_notifications: obj(), growth_graph: obj(), followers_graph: obj(), mute_graph: obj(), top_hours_graph: obj(), interactions_graph: obj(), iv_interactions_graph: obj(), views_by_source_graph: obj(), new_followers_by_source_graph: obj(), languages_graph: obj(), recent_message_interactions: vector(obj) });
const _helpPromoDataEmpty: any = () => ({ _: 'help.promoDataEmpty', expires: i32() });
const _helpPromoData = (): any => {
  const result: Record<string, unknown> = { _: 'help.promoData' };
  const flags = i32();
  result.proxy = !!(flags & 0x1);
  result.expires = i32();
  result.peer = obj();
  result.chats = vector(obj);
  result.users = vector(obj);
  if (flags & 0x2) result.psa_type = str();
  if (flags & 0x4) result.psa_message = str();
  return result;
};

const parserMap = new Map<number, () => any>([
  [0xbc799737, _boolFalse],
  [0x997275b5, _boolTrue],
  [0x3fedd339, _true],
  [0x1cb5c415, _vector],
  [0xc4b9f9bb, _error],
  [0x56730bcc, _null],
  [0x7f3b18ea, _inputPeerEmpty],
  [0x7da07ec9, _inputPeerSelf],
  [0x179be863, _inputPeerChat],
  [0x7b8e7de6, _inputPeerUser],
  [0x20adaef8, _inputPeerChannel],
  [0x17bae2e6, _inputPeerUserFromMessage],
  [0x9c95f7bb, _inputPeerChannelFromMessage],
  [0xb98886cf, _inputUserEmpty],
  [0xf7c1b13f, _inputUserSelf],
  [0xd8292816, _inputUser],
  [0x2d117597, _inputUserFromMessage],
  [0xf392b7f4, _inputPhoneContact],
  [0xf52ff27f, _inputFile],
  [0xfa4f0bb5, _inputFileBig],
  [0x9664f57f, _inputMediaEmpty],
  [0x1e287d04, _inputMediaUploadedPhoto],
  [0xb3ba0635, _inputMediaPhoto],
  [0xf9c44144, _inputMediaGeoPoint],
  [0xf8ab7dfb, _inputMediaContact],
  [0x5b38c6c1, _inputMediaUploadedDocument],
  [0x23ab23d2, _inputMediaDocument],
  [0xc13d1c11, _inputMediaVenue],
  [0x4843b0fd, _inputMediaGifExternal],
  [0xe5bbfe1a, _inputMediaPhotoExternal],
  [0xfb52dc99, _inputMediaDocumentExternal],
  [0xd33f43f3, _inputMediaGame],
  [0xf4e096c3, _inputMediaInvoice],
  [0xce4e82fd, _inputMediaGeoLive],
  [0xf94e5f1, _inputMediaPoll],
  [0xe66fbf7b, _inputMediaDice],
  [0x1ca48f57, _inputChatPhotoEmpty],
  [0x927c55b4, _inputChatUploadedPhoto],
  [0x8953ad37, _inputChatPhoto],
  [0xe4c123d6, _inputGeoPointEmpty],
  [0xf3b7acc9, _inputGeoPoint],
  [0x1cd7bf0d, _inputPhotoEmpty],
  [0x3bb3b94a, _inputPhoto],
  [0xdfdaabe1, _inputFileLocation],
  [0xf5235d55, _inputEncryptedFileLocation],
  [0xbad07584, _inputDocumentFileLocation],
  [0xcbc7ee28, _inputSecureFileLocation],
  [0x29be5899, _inputTakeoutFileLocation],
  [0x40181ffe, _inputPhotoFileLocation],
  [0xd83466f3, _inputPhotoLegacyFileLocation],
  [0x27d69997, _inputPeerPhotoFileLocation],
  [0xdbaeae9, _inputStickerSetThumb],
  [0x9db1bc6d, _peerUser],
  [0xbad0e5bb, _peerChat],
  [0xbddde532, _peerChannel],
  [0xaa963b05, _storageFileUnknown],
  [0x40bc6f52, _storageFilePartial],
  [0x7efe0e, _storageFileJpeg],
  [0xcae1aadf, _storageFileGif],
  [0xa4f63c0, _storageFilePng],
  [0xae1e508d, _storageFilePdf],
  [0x528a0677, _storageFileMp3],
  [0x4b09ebbc, _storageFileMov],
  [0xb3cea0e4, _storageFileMp4],
  [0x1081464c, _storageFileWebp],
  [0x200250ba, _userEmpty],
  [0x938458c1, _user],
  [0x4f11bae1, _userProfilePhotoEmpty],
  [0xecd75d8c, _userProfilePhoto],
  [0x9d05049, _userStatusEmpty],
  [0xedb93949, _userStatusOnline],
  [0x8c703f, _userStatusOffline],
  [0xe26f42f1, _userStatusRecently],
  [0x7bf09fc, _userStatusLastWeek],
  [0x77ebc742, _userStatusLastMonth],
  [0x9ba2d800, _chatEmpty],
  [0x3bda1bde, _chat],
  [0x7328bdb, _chatForbidden],
  [0xd31a961e, _channel],
  [0x289da732, _channelForbidden],
  [0x1b7c9db3, _chatFull],
  [0xf0e6672a, _channelFull],
  [0xc8d7493e, _chatParticipant],
  [0xda13538a, _chatParticipantCreator],
  [0xe2d6e436, _chatParticipantAdmin],
  [0xfc900c2b, _chatParticipantsForbidden],
  [0x3f460fed, _chatParticipants],
  [0x37c1011c, _chatPhotoEmpty],
  [0x475cdbd5, _chatPhoto],
  [0x83e5de54, _messageEmpty],
  [0x452c0e65, _message],
  [0x9e19a1f6, _messageService],
  [0x3ded6320, _messageMediaEmpty],
  [0x695150d7, _messageMediaPhoto],
  [0x56e0d474, _messageMediaGeo],
  [0xcbf24940, _messageMediaContact],
  [0x9f84f49e, _messageMediaUnsupported],
  [0x9cb070d7, _messageMediaDocument],
  [0xa32dd600, _messageMediaWebPage],
  [0x2ec0533f, _messageMediaVenue],
  [0xfdb19008, _messageMediaGame],
  [0x84551347, _messageMediaInvoice],
  [0x7c3c2609, _messageMediaGeoLive],
  [0x4bd6e798, _messageMediaPoll],
  [0x3f7ee58b, _messageMediaDice],
  [0xb6aef7b0, _messageActionEmpty],
  [0xa6638b9a, _messageActionChatCreate],
  [0xb5a1ce5a, _messageActionChatEditTitle],
  [0x7fcb13a8, _messageActionChatEditPhoto],
  [0x95e3fbef, _messageActionChatDeletePhoto],
  [0x488a7337, _messageActionChatAddUser],
  [0xb2ae9b0c, _messageActionChatDeleteUser],
  [0xf89cf5e8, _messageActionChatJoinedByLink],
  [0x95d2ac92, _messageActionChannelCreate],
  [0x51bdb021, _messageActionChatMigrateTo],
  [0xb055eaee, _messageActionChannelMigrateFrom],
  [0x94bd38ed, _messageActionPinMessage],
  [0x9fbab604, _messageActionHistoryClear],
  [0x92a72876, _messageActionGameScore],
  [0x8f31b327, _messageActionPaymentSentMe],
  [0x40699cd0, _messageActionPaymentSent],
  [0x80e11a7f, _messageActionPhoneCall],
  [0x4792929b, _messageActionScreenshotTaken],
  [0xfae69f56, _messageActionCustomAction],
  [0xabe9affe, _messageActionBotAllowed],
  [0x1b287353, _messageActionSecureValuesSentMe],
  [0xd95c6154, _messageActionSecureValuesSent],
  [0xf3f25f76, _messageActionContactSignUp],
  [0x2c171f72, _dialog],
  [0x71bd134c, _dialogFolder],
  [0x2331b22d, _photoEmpty],
  [0xd07504a5, _photo],
  [0xe17e23c, _photoSizeEmpty],
  [0x77bfb61b, _photoSize],
  [0xe9a734fa, _photoCachedSize],
  [0xe0b0bc2e, _photoStrippedSize],
  [0x1117dd5f, _geoPointEmpty],
  [0x296f104, _geoPoint],
  [0x5e002502, _authSentCode],
  [0xcd050916, _authAuthorization],
  [0x44747e9a, _authAuthorizationSignUpRequired],
  [0xdf969c2d, _authExportedAuthorization],
  [0xb8bc5b0c, _inputNotifyPeer],
  [0x193b4417, _inputNotifyUsers],
  [0x4a95e84e, _inputNotifyChats],
  [0xb1db7c7e, _inputNotifyBroadcasts],
  [0x9c3d198e, _inputPeerNotifySettings],
  [0xaf509d20, _peerNotifySettings],
  [0x818426cd, _peerSettings],
  [0xa437c3ed, _wallPaper],
  [0x8af40b25, _wallPaperNoFile],
  [0x58dbcab8, _inputReportReasonSpam],
  [0x1e22c78d, _inputReportReasonViolence],
  [0x2e59d922, _inputReportReasonPornography],
  [0xadf44ee3, _inputReportReasonChildAbuse],
  [0xe1746d0a, _inputReportReasonOther],
  [0x9b89f93a, _inputReportReasonCopyright],
  [0xdbd4feed, _inputReportReasonGeoIrrelevant],
  [0xedf17c12, _userFull],
  [0xf911c994, _contact],
  [0xd0028438, _importedContact],
  [0x561bc879, _contactBlocked],
  [0xd3680c61, _contactStatus],
  [0xb74ba9d2, _contactsContactsNotModified],
  [0xeae87e42, _contactsContacts],
  [0x77d01c3b, _contactsImportedContacts],
  [0x1c138d15, _contactsBlocked],
  [0x900802a1, _contactsBlockedSlice],
  [0x15ba6c40, _messagesDialogs],
  [0x71e094f3, _messagesDialogsSlice],
  [0xf0e3e596, _messagesDialogsNotModified],
  [0x8c718e87, _messagesMessages],
  [0xc8edce1e, _messagesMessagesSlice],
  [0x99262e37, _messagesChannelMessages],
  [0x74535f21, _messagesMessagesNotModified],
  [0x64ff9fd5, _messagesChats],
  [0x9cd81144, _messagesChatsSlice],
  [0xe5d7d19c, _messagesChatFull],
  [0xb45c69d1, _messagesAffectedHistory],
  [0x57e2f66c, _inputMessagesFilterEmpty],
  [0x9609a51c, _inputMessagesFilterPhotos],
  [0x9fc00e65, _inputMessagesFilterVideo],
  [0x56e9f0e4, _inputMessagesFilterPhotoVideo],
  [0x9eddf188, _inputMessagesFilterDocument],
  [0x7ef0dd87, _inputMessagesFilterUrl],
  [0xffc86587, _inputMessagesFilterGif],
  [0x50f5c392, _inputMessagesFilterVoice],
  [0x3751b49e, _inputMessagesFilterMusic],
  [0x3a20ecb8, _inputMessagesFilterChatPhotos],
  [0x80c99768, _inputMessagesFilterPhoneCalls],
  [0x7a7c17a4, _inputMessagesFilterRoundVoice],
  [0xb549da53, _inputMessagesFilterRoundVideo],
  [0xc1f8e69a, _inputMessagesFilterMyMentions],
  [0xe7026d0d, _inputMessagesFilterGeo],
  [0xe062db83, _inputMessagesFilterContacts],
  [0x1f2b0afd, _updateNewMessage],
  [0x4e90bfd6, _updateMessageID],
  [0xa20db0e5, _updateDeleteMessages],
  [0x5c486927, _updateUserTyping],
  [0x9a65ea1f, _updateChatUserTyping],
  [0x7761198, _updateChatParticipants],
  [0x1bfbd823, _updateUserStatus],
  [0xa7332b73, _updateUserName],
  [0x95313b0c, _updateUserPhoto],
  [0x12bcbd9a, _updateNewEncryptedMessage],
  [0x1710f156, _updateEncryptedChatTyping],
  [0xb4a2e88d, _updateEncryption],
  [0x38fe25b7, _updateEncryptedMessagesRead],
  [0xea4b0e5c, _updateChatParticipantAdd],
  [0x6e5f8c22, _updateChatParticipantDelete],
  [0x8e5e9873, _updateDcOptions],
  [0x80ece81a, _updateUserBlocked],
  [0xbec268ef, _updateNotifySettings],
  [0xebe46819, _updateServiceNotification],
  [0xee3b272a, _updatePrivacy],
  [0x12b9417b, _updateUserPhone],
  [0x9c974fdf, _updateReadHistoryInbox],
  [0x2f2f21bf, _updateReadHistoryOutbox],
  [0x7f891213, _updateWebPage],
  [0x68c13933, _updateReadMessagesContents],
  [0xeb0467fb, _updateChannelTooLong],
  [0xb6d45656, _updateChannel],
  [0x62ba04d9, _updateNewChannelMessage],
  [0x330b5424, _updateReadChannelInbox],
  [0xc37521c9, _updateDeleteChannelMessages],
  [0x98a12b4b, _updateChannelMessageViews],
  [0xb6901959, _updateChatParticipantAdmin],
  [0x688a30aa, _updateNewStickerSet],
  [0xbb2d201, _updateStickerSetsOrder],
  [0x43ae3dec, _updateStickerSets],
  [0x9375341e, _updateSavedGifs],
  [0x54826690, _updateBotInlineQuery],
  [0xe48f964, _updateBotInlineSend],
  [0x1b3f4df7, _updateEditChannelMessage],
  [0x98592475, _updateChannelPinnedMessage],
  [0xe73547e1, _updateBotCallbackQuery],
  [0xe40370a3, _updateEditMessage],
  [0xf9d27a5a, _updateInlineBotCallbackQuery],
  [0x25d6c9c7, _updateReadChannelOutbox],
  [0xee2bb969, _updateDraftMessage],
  [0x571d2742, _updateReadFeaturedStickers],
  [0x9a422c20, _updateRecentStickers],
  [0xa229dd06, _updateConfig],
  [0x3354678f, _updatePtsChanged],
  [0x40771900, _updateChannelWebPage],
  [0x6e6fe51c, _updateDialogPinned],
  [0xfa0f3ca2, _updatePinnedDialogs],
  [0x8317c0c3, _updateBotWebhookJSON],
  [0x9b9240a6, _updateBotWebhookJSONQuery],
  [0xe0cdc940, _updateBotShippingQuery],
  [0x5d2f3aa9, _updateBotPrecheckoutQuery],
  [0xab0f6b1e, _updatePhoneCall],
  [0x46560264, _updateLangPackTooLong],
  [0x56022f4d, _updateLangPack],
  [0xe511996d, _updateFavedStickers],
  [0x89893b45, _updateChannelReadMessagesContents],
  [0x7084a7be, _updateContactsReset],
  [0x70db6837, _updateChannelAvailableMessages],
  [0xe16459c3, _updateDialogUnreadMark],
  [0x4c43da18, _updateUserPinnedMessage],
  [0xe10db349, _updateChatPinnedMessage],
  [0xaca1657b, _updateMessagePoll],
  [0x54c01850, _updateChatDefaultBannedRights],
  [0x19360dc0, _updateFolderPeers],
  [0x6a7e7366, _updatePeerSettings],
  [0xb4afcfb0, _updatePeerLocated],
  [0x39a51dfb, _updateNewScheduledMessage],
  [0x90866cee, _updateDeleteScheduledMessages],
  [0x8216fba3, _updateTheme],
  [0x871fb939, _updateGeoLiveViewed],
  [0x564fe691, _updateLoginToken],
  [0x42f88f2c, _updateMessagePollVote],
  [0x26ffde7d, _updateDialogFilter],
  [0xa5d72105, _updateDialogFilterOrder],
  [0x3504914f, _updateDialogFilters],
  [0xa56c2a3e, _updatesState],
  [0x5d75a138, _updatesDifferenceEmpty],
  [0xf49ca0, _updatesDifference],
  [0xa8fb1981, _updatesDifferenceSlice],
  [0x4afe8f6d, _updatesDifferenceTooLong],
  [0xe317af7e, _updatesTooLong],
  [0x914fbf11, _updateShortMessage],
  [0x16812688, _updateShortChatMessage],
  [0x78d4dec1, _updateShort],
  [0x725b04c3, _updatesCombined],
  [0x74ae4240, _updates],
  [0x11f1331c, _updateShortSentMessage],
  [0x8dca6aa5, _photosPhotos],
  [0x15051f54, _photosPhotosSlice],
  [0x20212ca8, _photosPhoto],
  [0x96a18d5, _uploadFile],
  [0xf18cda44, _uploadFileCdnRedirect],
  [0x18b7a10d, _dcOption],
  [0x330b4067, _config],
  [0x8e1a1775, _nearestDc],
  [0x1da7158f, _helpAppUpdate],
  [0xc45a6536, _helpNoAppUpdate],
  [0x18cb9f78, _helpInviteText],
  [0xab7ec0a0, _encryptedChatEmpty],
  [0x3bf703dc, _encryptedChatWaiting],
  [0xc878527e, _encryptedChatRequested],
  [0xfa56ce36, _encryptedChat],
  [0x13d6dd27, _encryptedChatDiscarded],
  [0xf141b5e1, _inputEncryptedChat],
  [0xc21f497e, _encryptedFileEmpty],
  [0x4a70994c, _encryptedFile],
  [0x1837c364, _inputEncryptedFileEmpty],
  [0x64bd0306, _inputEncryptedFileUploaded],
  [0x5a17b5e5, _inputEncryptedFile],
  [0x2dc173c8, _inputEncryptedFileBigUploaded],
  [0xed18c118, _encryptedMessage],
  [0x23734b06, _encryptedMessageService],
  [0xc0e24635, _messagesDhConfigNotModified],
  [0x2c221edd, _messagesDhConfig],
  [0x560f8935, _messagesSentEncryptedMessage],
  [0x9493ff32, _messagesSentEncryptedFile],
  [0x72f0eaae, _inputDocumentEmpty],
  [0x1abfb575, _inputDocument],
  [0x36f8c871, _documentEmpty],
  [0x9ba29cc1, _document],
  [0x17c6b5f6, _helpSupport],
  [0x9fd40bd8, _notifyPeer],
  [0xb4c83b4c, _notifyUsers],
  [0xc007cec3, _notifyChats],
  [0xd612e8ef, _notifyBroadcasts],
  [0x16bf744e, _sendMessageTypingAction],
  [0xfd5ec8f5, _sendMessageCancelAction],
  [0xa187d66f, _sendMessageRecordVideoAction],
  [0xe9763aec, _sendMessageUploadVideoAction],
  [0xd52f73f7, _sendMessageRecordAudioAction],
  [0xf351d7ab, _sendMessageUploadAudioAction],
  [0xd1d34a26, _sendMessageUploadPhotoAction],
  [0xaa0cd9e4, _sendMessageUploadDocumentAction],
  [0x176f8ba1, _sendMessageGeoLocationAction],
  [0x628cbc6f, _sendMessageChooseContactAction],
  [0xdd6a8f48, _sendMessageGamePlayAction],
  [0x88f27fbc, _sendMessageRecordRoundAction],
  [0x243e1c66, _sendMessageUploadRoundAction],
  [0xb3134d9d, _contactsFound],
  [0x4f96cb18, _inputPrivacyKeyStatusTimestamp],
  [0xbdfb0426, _inputPrivacyKeyChatInvite],
  [0xfabadc5f, _inputPrivacyKeyPhoneCall],
  [0xdb9e70d2, _inputPrivacyKeyPhoneP2P],
  [0xa4dd4c08, _inputPrivacyKeyForwards],
  [0x5719bacc, _inputPrivacyKeyProfilePhoto],
  [0x352dafa, _inputPrivacyKeyPhoneNumber],
  [0xd1219bdd, _inputPrivacyKeyAddedByPhone],
  [0xbc2eab30, _privacyKeyStatusTimestamp],
  [0x500e6dfa, _privacyKeyChatInvite],
  [0x3d662b7b, _privacyKeyPhoneCall],
  [0x39491cc8, _privacyKeyPhoneP2P],
  [0x69ec56a3, _privacyKeyForwards],
  [0x96151fed, _privacyKeyProfilePhoto],
  [0xd19ae46d, _privacyKeyPhoneNumber],
  [0x42ffd42b, _privacyKeyAddedByPhone],
  [0xd09e07b, _inputPrivacyValueAllowContacts],
  [0x184b35ce, _inputPrivacyValueAllowAll],
  [0x131cc67f, _inputPrivacyValueAllowUsers],
  [0xba52007, _inputPrivacyValueDisallowContacts],
  [0xd66b66c9, _inputPrivacyValueDisallowAll],
  [0x90110467, _inputPrivacyValueDisallowUsers],
  [0x4c81c1ba, _inputPrivacyValueAllowChatParticipants],
  [0xd82363af, _inputPrivacyValueDisallowChatParticipants],
  [0xfffe1bac, _privacyValueAllowContacts],
  [0x65427b82, _privacyValueAllowAll],
  [0x4d5bbe0c, _privacyValueAllowUsers],
  [0xf888fa1a, _privacyValueDisallowContacts],
  [0x8b73e763, _privacyValueDisallowAll],
  [0xc7f49b7, _privacyValueDisallowUsers],
  [0x18be796b, _privacyValueAllowChatParticipants],
  [0xacae0690, _privacyValueDisallowChatParticipants],
  [0x50a04e45, _accountPrivacyRules],
  [0xb8d0afdf, _accountDaysTTL],
  [0x6c37c15c, _documentAttributeImageSize],
  [0x11b58939, _documentAttributeAnimated],
  [0x6319d612, _documentAttributeSticker],
  [0xef02ce6, _documentAttributeVideo],
  [0x9852f9c6, _documentAttributeAudio],
  [0x15590068, _documentAttributeFilename],
  [0x9801d2f7, _documentAttributeHasStickers],
  [0xf1749a22, _messagesStickersNotModified],
  [0xe4599bbd, _messagesStickers],
  [0x12b299d4, _stickerPack],
  [0xe86602c3, _messagesAllStickersNotModified],
  [0xedfd405f, _messagesAllStickers],
  [0x84d19185, _messagesAffectedMessages],
  [0xeb1477e8, _webPageEmpty],
  [0xc586da1c, _webPagePending],
  [0xe89c45b2, _webPage],
  [0x7311ca11, _webPageNotModified],
  [0xad01d61d, _authorization],
  [0x1250abde, _accountAuthorizations],
  [0xad2641f8, _accountPassword],
  [0x9a5c33e5, _accountPasswordSettings],
  [0xc23727c9, _accountPasswordInputSettings],
  [0x137948a5, _authPasswordRecovery],
  [0xa384b779, _receivedNotifyMessage],
  [0x69df3769, _chatInviteEmpty],
  [0xfc2e05bc, _chatInviteExported],
  [0x5a686d7c, _chatInviteAlready],
  [0xdfc2f58e, _chatInvite],
  [0xffb62b95, _inputStickerSetEmpty],
  [0x9de7a269, _inputStickerSetID],
  [0x861cc8a0, _inputStickerSetShortName],
  [0x28703c8, _inputStickerSetAnimatedEmoji],
  [0xe67f520e, _inputStickerSetDice],
  [0xeeb46f27, _stickerSet],
  [0xb60a24a6, _messagesStickerSet],
  [0xc27ac8c7, _botCommand],
  [0x98e81d3a, _botInfo],
  [0xa2fa4880, _keyboardButton],
  [0x258aff05, _keyboardButtonUrl],
  [0x683a5e46, _keyboardButtonCallback],
  [0xb16a6c29, _keyboardButtonRequestPhone],
  [0xfc796b3f, _keyboardButtonRequestGeoLocation],
  [0x568a748, _keyboardButtonSwitchInline],
  [0x50f41ccf, _keyboardButtonGame],
  [0xafd93fbb, _keyboardButtonBuy],
  [0x10b78d29, _keyboardButtonUrlAuth],
  [0xd02e7fd4, _inputKeyboardButtonUrlAuth],
  [0xbbc7515d, _keyboardButtonRequestPoll],
  [0x77608b83, _keyboardButtonRow],
  [0xa03e5b85, _replyKeyboardHide],
  [0xf4108aa0, _replyKeyboardForceReply],
  [0x3502758c, _replyKeyboardMarkup],
  [0x48a30254, _replyInlineMarkup],
  [0xbb92ba95, _messageEntityUnknown],
  [0xfa04579d, _messageEntityMention],
  [0x6f635b0d, _messageEntityHashtag],
  [0x6cef8ac7, _messageEntityBotCommand],
  [0x6ed02538, _messageEntityUrl],
  [0x64e475c2, _messageEntityEmail],
  [0xbd610bc9, _messageEntityBold],
  [0x826f8b60, _messageEntityItalic],
  [0x28a20571, _messageEntityCode],
  [0x73924be0, _messageEntityPre],
  [0x76a6d327, _messageEntityTextUrl],
  [0x352dca58, _messageEntityMentionName],
  [0x208e68c9, _inputMessageEntityMentionName],
  [0x9b69e34b, _messageEntityPhone],
  [0x4c4e743f, _messageEntityCashtag],
  [0x9c4e7e8b, _messageEntityUnderline],
  [0xbf0693d4, _messageEntityStrike],
  [0x20df5d0, _messageEntityBlockquote],
  [0x761e6af4, _messageEntityBankCard],
  [0xee8c1e86, _inputChannelEmpty],
  [0xafeb712e, _inputChannel],
  [0x2a286531, _inputChannelFromMessage],
  [0x7f077ad9, _contactsResolvedPeer],
  [0xae30253, _messageRange],
  [0x3e11affb, _updatesChannelDifferenceEmpty],
  [0xa4bcc6fe, _updatesChannelDifferenceTooLong],
  [0x2064674e, _updatesChannelDifference],
  [0x94d42ee7, _channelMessagesFilterEmpty],
  [0xcd77d957, _channelMessagesFilter],
  [0x15ebac1d, _channelParticipant],
  [0xa3289a6d, _channelParticipantSelf],
  [0x808d15a4, _channelParticipantCreator],
  [0xccbebbaf, _channelParticipantAdmin],
  [0x1c0facaf, _channelParticipantBanned],
  [0xde3f3c79, _channelParticipantsRecent],
  [0xb4608969, _channelParticipantsAdmins],
  [0xa3b54985, _channelParticipantsKicked],
  [0xb0d1865b, _channelParticipantsBots],
  [0x1427a5e1, _channelParticipantsBanned],
  [0x656ac4b, _channelParticipantsSearch],
  [0xbb6ae88d, _channelParticipantsContacts],
  [0xf56ee2a8, _channelsChannelParticipants],
  [0xf0173fe9, _channelsChannelParticipantsNotModified],
  [0xd0d9b163, _channelsChannelParticipant],
  [0x780a0310, _helpTermsOfService],
  [0x162ecc1f, _foundGif],
  [0x9c750409, _foundGifCached],
  [0x450a1c0a, _messagesFoundGifs],
  [0xe8025ca2, _messagesSavedGifsNotModified],
  [0x2e0709a5, _messagesSavedGifs],
  [0x3380c786, _inputBotInlineMessageMediaAuto],
  [0x3dcd7a87, _inputBotInlineMessageText],
  [0xc1b15d65, _inputBotInlineMessageMediaGeo],
  [0x417bbf11, _inputBotInlineMessageMediaVenue],
  [0xa6edbffd, _inputBotInlineMessageMediaContact],
  [0x4b425864, _inputBotInlineMessageGame],
  [0x88bf9319, _inputBotInlineResult],
  [0xa8d864a7, _inputBotInlineResultPhoto],
  [0xfff8fdc4, _inputBotInlineResultDocument],
  [0x4fa417f2, _inputBotInlineResultGame],
  [0x764cf810, _botInlineMessageMediaAuto],
  [0x8c7f65e2, _botInlineMessageText],
  [0xb722de65, _botInlineMessageMediaGeo],
  [0x8a86659c, _botInlineMessageMediaVenue],
  [0x18d1cdc2, _botInlineMessageMediaContact],
  [0x11965f3a, _botInlineResult],
  [0x17db940b, _botInlineMediaResult],
  [0x947ca848, _messagesBotResults],
  [0x5dab1af4, _exportedMessageLink],
  [0x353a686b, _messageFwdHeader],
  [0x72a3158c, _authCodeTypeSms],
  [0x741cd3e3, _authCodeTypeCall],
  [0x226ccefb, _authCodeTypeFlashCall],
  [0x3dbb5986, _authSentCodeTypeApp],
  [0xc000bba2, _authSentCodeTypeSms],
  [0x5353e5a7, _authSentCodeTypeCall],
  [0xab03c6d9, _authSentCodeTypeFlashCall],
  [0x36585ea4, _messagesBotCallbackAnswer],
  [0x26b5dde6, _messagesMessageEditData],
  [0x890c3d89, _inputBotInlineMessageID],
  [0x3c20629f, _inlineBotSwitchPM],
  [0x3371c354, _messagesPeerDialogs],
  [0xedcdc05b, _topPeer],
  [0xab661b5b, _topPeerCategoryBotsPM],
  [0x148677e2, _topPeerCategoryBotsInline],
  [0x637b7ed, _topPeerCategoryCorrespondents],
  [0xbd17a14a, _topPeerCategoryGroups],
  [0x161d9628, _topPeerCategoryChannels],
  [0x1e76a78c, _topPeerCategoryPhoneCalls],
  [0xa8406ca9, _topPeerCategoryForwardUsers],
  [0xfbeec0f0, _topPeerCategoryForwardChats],
  [0xfb834291, _topPeerCategoryPeers],
  [0xde266ef5, _contactsTopPeersNotModified],
  [0x70b772a8, _contactsTopPeers],
  [0xb52c939d, _contactsTopPeersDisabled],
  [0x1b0c841a, _draftMessageEmpty],
  [0xfd8e711f, _draftMessage],
  [0xc6dc0c66, _messagesFeaturedStickersNotModified],
  [0xb6abc341, _messagesFeaturedStickers],
  [0xb17f890, _messagesRecentStickersNotModified],
  [0x22f3afb3, _messagesRecentStickers],
  [0x4fcba9c8, _messagesArchivedStickers],
  [0x38641628, _messagesStickerSetInstallResultSuccess],
  [0x35e410a8, _messagesStickerSetInstallResultArchive],
  [0x6410a5d2, _stickerSetCovered],
  [0x3407e51b, _stickerSetMultiCovered],
  [0xaed6dbb2, _maskCoords],
  [0x4a992157, _inputStickeredMediaPhoto],
  [0x438865b, _inputStickeredMediaDocument],
  [0xbdf9653b, _game],
  [0x32c3e77, _inputGameID],
  [0xc331e80a, _inputGameShortName],
  [0x58fffcd0, _highScore],
  [0x9a3bfd99, _messagesHighScores],
  [0xdc3d824f, _textEmpty],
  [0x744694e0, _textPlain],
  [0x6724abc4, _textBold],
  [0xd912a59c, _textItalic],
  [0xc12622c4, _textUnderline],
  [0x9bf8bb95, _textStrike],
  [0x6c3f19b9, _textFixed],
  [0x3c2884c1, _textUrl],
  [0xde5a0dd6, _textEmail],
  [0x7e6260d7, _textConcat],
  [0xed6a8504, _textSubscript],
  [0xc7fb5e01, _textSuperscript],
  [0x34b8621, _textMarked],
  [0x1ccb966a, _textPhone],
  [0x81ccf4f, _textImage],
  [0x35553762, _textAnchor],
  [0x13567e8a, _pageBlockUnsupported],
  [0x70abc3fd, _pageBlockTitle],
  [0x8ffa9a1f, _pageBlockSubtitle],
  [0xbaafe5e0, _pageBlockAuthorDate],
  [0xbfd064ec, _pageBlockHeader],
  [0xf12bb6e1, _pageBlockSubheader],
  [0x467a0766, _pageBlockParagraph],
  [0xc070d93e, _pageBlockPreformatted],
  [0x48870999, _pageBlockFooter],
  [0xdb20b188, _pageBlockDivider],
  [0xce0d37b0, _pageBlockAnchor],
  [0xe4e88011, _pageBlockList],
  [0x263d7c26, _pageBlockBlockquote],
  [0x4f4456d3, _pageBlockPullquote],
  [0x1759c560, _pageBlockPhoto],
  [0x7c8fe7b6, _pageBlockVideo],
  [0x39f23300, _pageBlockCover],
  [0xa8718dc5, _pageBlockEmbed],
  [0xf259a80b, _pageBlockEmbedPost],
  [0x65a0fa4d, _pageBlockCollage],
  [0x31f9590, _pageBlockSlideshow],
  [0xef1751b5, _pageBlockChannel],
  [0x804361ea, _pageBlockAudio],
  [0x1e148390, _pageBlockKicker],
  [0xbf4dea82, _pageBlockTable],
  [0x9a8ae1e1, _pageBlockOrderedList],
  [0x76768bed, _pageBlockDetails],
  [0x16115a96, _pageBlockRelatedArticles],
  [0xa44f3ef6, _pageBlockMap],
  [0x85e42301, _phoneCallDiscardReasonMissed],
  [0xe095c1a0, _phoneCallDiscardReasonDisconnect],
  [0x57adc690, _phoneCallDiscardReasonHangup],
  [0xfaf7e8c9, _phoneCallDiscardReasonBusy],
  [0x7d748d04, _dataJSON],
  [0xcb296bf8, _labeledPrice],
  [0xc30aa358, _invoice],
  [0xea02c27e, _paymentCharge],
  [0x1e8caaeb, _postAddress],
  [0x909c3f94, _paymentRequestedInfo],
  [0xcdc27a1f, _paymentSavedCredentialsCard],
  [0x1c570ed1, _webDocument],
  [0xf9c8bcc6, _webDocumentNoProxy],
  [0x9bed434d, _inputWebDocument],
  [0xc239d686, _inputWebFileLocation],
  [0x9f2221c9, _inputWebFileGeoPointLocation],
  [0x21e753bc, _uploadWebFile],
  [0x3f56aea3, _paymentsPaymentForm],
  [0xd1451883, _paymentsValidatedRequestedInfo],
  [0x4e5f810d, _paymentsPaymentResult],
  [0xd8411139, _paymentsPaymentVerificationNeeded],
  [0x500911e1, _paymentsPaymentReceipt],
  [0xfb8fe43c, _paymentsSavedInfo],
  [0xc10eb2cf, _inputPaymentCredentialsSaved],
  [0x3417d728, _inputPaymentCredentials],
  [0xaa1c39f, _inputPaymentCredentialsApplePay],
  [0xca05d50e, _inputPaymentCredentialsAndroidPay],
  [0xdb64fd34, _accountTmpPassword],
  [0xb6213cdf, _shippingOption],
  [0xffa0a496, _inputStickerSetItem],
  [0x1e36fded, _inputPhoneCall],
  [0x5366c915, _phoneCallEmpty],
  [0x1b8f4ad1, _phoneCallWaiting],
  [0x87eabb53, _phoneCallRequested],
  [0x997c454a, _phoneCallAccepted],
  [0x8742ae7f, _phoneCall],
  [0x50ca4de1, _phoneCallDiscarded],
  [0x9d4c17c0, _phoneConnection],
  [0xfc878fc8, _phoneCallProtocol],
  [0xec82e140, _phonePhoneCall],
  [0xeea8e46e, _uploadCdnFileReuploadNeeded],
  [0xa99fca4f, _uploadCdnFile],
  [0xc982eaba, _cdnPublicKey],
  [0x5725e40a, _cdnConfig],
  [0xcad181f6, _langPackString],
  [0x6c47ac9f, _langPackStringPluralized],
  [0x2979eeb2, _langPackStringDeleted],
  [0xf385c1f6, _langPackDifference],
  [0xeeca5ce3, _langPackLanguage],
  [0xe6dfb825, _channelAdminLogEventActionChangeTitle],
  [0x55188a2e, _channelAdminLogEventActionChangeAbout],
  [0x6a4afc38, _channelAdminLogEventActionChangeUsername],
  [0x434bd2af, _channelAdminLogEventActionChangePhoto],
  [0x1b7907ae, _channelAdminLogEventActionToggleInvites],
  [0x26ae0971, _channelAdminLogEventActionToggleSignatures],
  [0xe9e82c18, _channelAdminLogEventActionUpdatePinned],
  [0x709b2405, _channelAdminLogEventActionEditMessage],
  [0x42e047bb, _channelAdminLogEventActionDeleteMessage],
  [0x183040d3, _channelAdminLogEventActionParticipantJoin],
  [0xf89777f2, _channelAdminLogEventActionParticipantLeave],
  [0xe31c34d8, _channelAdminLogEventActionParticipantInvite],
  [0xe6d83d7e, _channelAdminLogEventActionParticipantToggleBan],
  [0xd5676710, _channelAdminLogEventActionParticipantToggleAdmin],
  [0xb1c3caa7, _channelAdminLogEventActionChangeStickerSet],
  [0x5f5c95f1, _channelAdminLogEventActionTogglePreHistoryHidden],
  [0x2df5fc0a, _channelAdminLogEventActionDefaultBannedRights],
  [0x8f079643, _channelAdminLogEventActionStopPoll],
  [0xa26f881b, _channelAdminLogEventActionChangeLinkedChat],
  [0xe6b76ae, _channelAdminLogEventActionChangeLocation],
  [0x53909779, _channelAdminLogEventActionToggleSlowMode],
  [0x3b5a3e40, _channelAdminLogEvent],
  [0xed8af74d, _channelsAdminLogResults],
  [0xea107ae4, _channelAdminLogEventsFilter],
  [0x5ce14175, _popularContact],
  [0x9e8fa6d3, _messagesFavedStickersNotModified],
  [0xf37f2f16, _messagesFavedStickers],
  [0x46e1d13d, _recentMeUrlUnknown],
  [0x8dbc3336, _recentMeUrlUser],
  [0xa01b22f9, _recentMeUrlChat],
  [0xeb49081d, _recentMeUrlChatInvite],
  [0xbc0a57dc, _recentMeUrlStickerSet],
  [0xe0310d7, _helpRecentMeUrls],
  [0x1cc6e91f, _inputSingleMedia],
  [0xcac943f2, _webAuthorization],
  [0xed56c9fc, _accountWebAuthorizations],
  [0xa676a322, _inputMessageID],
  [0xbad88395, _inputMessageReplyTo],
  [0x86872538, _inputMessagePinned],
  [0xfcaafeb7, _inputDialogPeer],
  [0x64600527, _inputDialogPeerFolder],
  [0xe56dbf05, _dialogPeer],
  [0x514519e2, _dialogPeerFolder],
  [0xd54b65d, _messagesFoundStickerSetsNotModified],
  [0x5108d648, _messagesFoundStickerSets],
  [0x6242c773, _fileHash],
  [0x75588b3f, _inputClientProxy],
  [0xe3309f7f, _helpTermsOfServiceUpdateEmpty],
  [0x28ecf961, _helpTermsOfServiceUpdate],
  [0x3334b0f0, _inputSecureFileUploaded],
  [0x5367e5be, _inputSecureFile],
  [0x64199744, _secureFileEmpty],
  [0xe0277a62, _secureFile],
  [0x8aeabec3, _secureData],
  [0x7d6099dd, _securePlainPhone],
  [0x21ec5a5f, _securePlainEmail],
  [0x9d2a81e3, _secureValueTypePersonalDetails],
  [0x3dac6a00, _secureValueTypePassport],
  [0x6e425c4, _secureValueTypeDriverLicense],
  [0xa0d0744b, _secureValueTypeIdentityCard],
  [0x99a48f23, _secureValueTypeInternalPassport],
  [0xcbe31e26, _secureValueTypeAddress],
  [0xfc36954e, _secureValueTypeUtilityBill],
  [0x89137c0d, _secureValueTypeBankStatement],
  [0x8b883488, _secureValueTypeRentalAgreement],
  [0x99e3806a, _secureValueTypePassportRegistration],
  [0xea02ec33, _secureValueTypeTemporaryRegistration],
  [0xb320aadb, _secureValueTypePhone],
  [0x8e3ca7ee, _secureValueTypeEmail],
  [0x187fa0ca, _secureValue],
  [0xdb21d0a7, _inputSecureValue],
  [0xed1ecdb0, _secureValueHash],
  [0xe8a40bd9, _secureValueErrorData],
  [0xbe3dfa, _secureValueErrorFrontSide],
  [0x868a2aa5, _secureValueErrorReverseSide],
  [0xe537ced6, _secureValueErrorSelfie],
  [0x7a700873, _secureValueErrorFile],
  [0x666220e9, _secureValueErrorFiles],
  [0x869d758f, _secureValueError],
  [0xa1144770, _secureValueErrorTranslationFile],
  [0x34636dd8, _secureValueErrorTranslationFiles],
  [0x33f0ea47, _secureCredentialsEncrypted],
  [0xad2e1cd8, _accountAuthorizationForm],
  [0x811f854f, _accountSentEmailCode],
  [0x66afa166, _helpDeepLinkInfoEmpty],
  [0x6a4ee832, _helpDeepLinkInfo],
  [0x1142bd56, _savedPhoneContact],
  [0x4dba4501, _accountTakeout],
  [0xd45ab096, _passwordKdfAlgoUnknown],
  [0x3a912d4a, _passwordKdfAlgoSHA256SHA256PBKDF2HMACSHA512iter100000SHA256ModPow],
  [0x4a8537, _securePasswordKdfAlgoUnknown],
  [0xbbf2dda0, _securePasswordKdfAlgoPBKDF2HMACSHA512iter100000],
  [0x86471d92, _securePasswordKdfAlgoSHA512],
  [0x1527bcac, _secureSecretSettings],
  [0x9880f658, _inputCheckPasswordEmpty],
  [0xd27ff082, _inputCheckPasswordSRP],
  [0x829d99da, _secureRequiredType],
  [0x27477b4, _secureRequiredTypeOneOf],
  [0xbfb9f457, _helpPassportConfigNotModified],
  [0xa098d6af, _helpPassportConfig],
  [0x1d1b1245, _inputAppEvent],
  [0xc0de1bd9, _jsonObjectValue],
  [0x3f6d7b68, _jsonNull],
  [0xc7345e6a, _jsonBool],
  [0x2be0dfa4, _jsonNumber],
  [0xb71e767a, _jsonString],
  [0xf7444763, _jsonArray],
  [0x99c1d49d, _jsonObject],
  [0x34566b6a, _pageTableCell],
  [0xe0c0c5e5, _pageTableRow],
  [0x6f747657, _pageCaption],
  [0xb92fb6cd, _pageListItemText],
  [0x25e073fc, _pageListItemBlocks],
  [0x5e068047, _pageListOrderedItemText],
  [0x98dd8936, _pageListOrderedItemBlocks],
  [0xb390dc08, _pageRelatedArticle],
  [0x98657f0d, _page],
  [0x8c05f1c9, _helpSupportName],
  [0xf3ae2eed, _helpUserInfoEmpty],
  [0x1eb3758, _helpUserInfo],
  [0x6ca9c2e9, _pollAnswer],
  [0x86e18161, _poll],
  [0x3b6ddad2, _pollAnswerVoters],
  [0xbadcc1a3, _pollResults],
  [0xf041e250, _chatOnlines],
  [0x47a971e0, _statsURL],
  [0x5fb224d5, _chatAdminRights],
  [0x9f120418, _chatBannedRights],
  [0xe630b979, _inputWallPaper],
  [0x72091c80, _inputWallPaperSlug],
  [0x8427bbac, _inputWallPaperNoFile],
  [0x1c199183, _accountWallPapersNotModified],
  [0x702b65a9, _accountWallPapers],
  [0xdebebe83, _codeSettings],
  [0x5086cf8, _wallPaperSettings],
  [0xe04232f3, _autoDownloadSettings],
  [0x63cacf26, _accountAutoDownloadSettings],
  [0xd5b3b9f9, _emojiKeyword],
  [0x236df622, _emojiKeywordDeleted],
  [0x5cc761bd, _emojiKeywordsDifference],
  [0xa575739d, _emojiURL],
  [0xb3fb5361, _emojiLanguage],
  [0xbc7fc6cd, _fileLocationToBeDeprecated],
  [0xff544e65, _folder],
  [0xfbd2c296, _inputFolderPeer],
  [0xe9baa668, _folderPeer],
  [0xe844ebff, _messagesSearchCounter],
  [0x92d33a0e, _urlAuthResultRequest],
  [0x8f8c0e4e, _urlAuthResultAccepted],
  [0xa9d6db1f, _urlAuthResultDefault],
  [0xbfb5ad8b, _channelLocationEmpty],
  [0x209b82db, _channelLocation],
  [0xca461b5d, _peerLocated],
  [0xf8ec284b, _peerSelfLocated],
  [0xd072acb4, _restrictionReason],
  [0x3c5693e9, _inputTheme],
  [0xf5890df1, _inputThemeSlug],
  [0x28f1114, _theme],
  [0xf41eb622, _accountThemesNotModified],
  [0x7f676421, _accountThemes],
  [0x629f1980, _authLoginToken],
  [0x68e9916, _authLoginTokenMigrateTo],
  [0x390d5c5e, _authLoginTokenSuccess],
  [0x57e28221, _accountContentSettings],
  [0xa927fec5, _messagesInactiveChats],
  [0xc3a12462, _baseThemeClassic],
  [0xfbd81688, _baseThemeDay],
  [0xb7b31ea8, _baseThemeNight],
  [0x6d5f77ee, _baseThemeTinted],
  [0x5b11125a, _baseThemeArctic],
  [0xbd507cd1, _inputThemeSettings],
  [0x9c14984a, _themeSettings],
  [0x54b56617, _webPageAttributeTheme],
  [0xa28e5559, _messageUserVote],
  [0x36377430, _messageUserVoteInputOption],
  [0xe8fe0de, _messageUserVoteMultiple],
  [0x823f649, _messagesVotesList],
  [0xf568028a, _bankCardOpenUrl],
  [0x3e24e573, _paymentsBankCardData],
  [0x7438f7e8, _dialogFilter],
  [0x77744d4a, _dialogFilterSuggested],
  [0xb637edaf, _statsDateRangeDays],
  [0xcb43acde, _statsAbsValueAndPrev],
  [0xcbce2fe0, _statsPercentValue],
  [0x4a27eb2d, _statsGraphAsync],
  [0xbedc9822, _statsGraphError],
  [0x8ea464b6, _statsGraph],
  [0xad4fc9bd, _messageInteractionCounters],
  [0xbdf78394, _statsBroadcastStats],
  [0x98f6ac75, _helpPromoDataEmpty],
  [0x8c39793f, _helpPromoData],
]);

const i32 = () => r.int32();
const i64 = () => r.long();
const f64 = () => r.double();
const str = () => r.string();
const bytes = () => r.bytes();

function vector(t: () => any, bare = false) {
  if (!bare) { i32(); /* ignoring constructor id. */ }
  const len = i32();
  const result = [];
  for (let i = 0; i < len; ++i) result.push(t());
  return result;
}

function obj() {
  const c = i32() >>> 0;
  const f = parserMap.get(c);
  if (f) return f();
  if (fallbackParse) {
    r.rollback();
    return fallbackParse(r);
  }
  console.error(`Unknown constructor 0x${c.toString(16)}.`);
  return undefined;
}
