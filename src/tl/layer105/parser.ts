/* eslint-disable no-spaced-func */
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/camelcase, @typescript-eslint/no-use-before-define */

/**
 * This file was automatically generated (https://github.com/misupov/tg-schema-generator).
 *
 * Do not make changes to this file unless you know what you are doing -- modify
 * the tool instead.
 *
 * Source: layer105.json (md5: 15f299b996d718182fbb8b20f18b8ddd)
 * Time: Thursday, 09 April 2020 07:57:16 (UTC)
 */

interface Reader {
  int32(): number;
  int64(): string;
  int128(): Uint32Array;
  int256(): Uint32Array;
  double(): number;
  string(): string;
  bytes(): ArrayBuffer;
}

let r: Reader;

export default function parse(reader: Reader): any {
  r = reader;
  return obj();
}

const _vector: any = () => ({ _: 'vector' });
const _resPQ: any = () => ({ _: 'resPQ', nonce: i128(), server_nonce: i128(), pq: bytes(), server_public_key_fingerprints: vector(i64) });
const _p_q_inner_data: any = () => ({ _: 'p_q_inner_data', pq: bytes(), p: bytes(), q: bytes(), nonce: i128(), server_nonce: i128(), new_nonce: i256() });
const _p_q_inner_data_dc: any = () => ({ _: 'p_q_inner_data_dc', pq: bytes(), p: bytes(), q: bytes(), nonce: i128(), server_nonce: i128(), new_nonce: i256(), dc: i32() });
const _p_q_inner_data_temp: any = () => ({ _: 'p_q_inner_data_temp', pq: bytes(), p: bytes(), q: bytes(), nonce: i128(), server_nonce: i128(), new_nonce: i256(), expires_in: i32() });
const _p_q_inner_data_temp_dc: any = () => ({ _: 'p_q_inner_data_temp_dc', pq: bytes(), p: bytes(), q: bytes(), nonce: i128(), server_nonce: i128(), new_nonce: i256(), dc: i32(), expires_in: i32() });
const _server_DH_params_fail: any = () => ({ _: 'server_DH_params_fail', nonce: i128(), server_nonce: i128(), new_nonce_hash: i128() });
const _server_DH_params_ok: any = () => ({ _: 'server_DH_params_ok', nonce: i128(), server_nonce: i128(), encrypted_answer: bytes() });
const _server_DH_inner_data: any = () => ({ _: 'server_DH_inner_data', nonce: i128(), server_nonce: i128(), g: i32(), dh_prime: bytes(), g_a: bytes(), server_time: i32() });
const _client_DH_inner_data: any = () => ({ _: 'client_DH_inner_data', nonce: i128(), server_nonce: i128(), retry_id: i64(), g_b: bytes() });
const _dh_gen_ok: any = () => ({ _: 'dh_gen_ok', nonce: i128(), server_nonce: i128(), new_nonce_hash1: i128() });
const _dh_gen_retry: any = () => ({ _: 'dh_gen_retry', nonce: i128(), server_nonce: i128(), new_nonce_hash2: i128() });
const _dh_gen_fail: any = () => ({ _: 'dh_gen_fail', nonce: i128(), server_nonce: i128(), new_nonce_hash3: i128() });
const _rpc_result: any = () => ({ _: 'rpc_result', req_msg_id: i64(), result: obj() });
const _rpc_error: any = () => ({ _: 'rpc_error', error_code: i32(), error_message: str() });
const _rpc_answer_unknown: any = () => ({ _: 'rpc_answer_unknown' });
const _rpc_answer_dropped_running: any = () => ({ _: 'rpc_answer_dropped_running' });
const _rpc_answer_dropped: any = () => ({ _: 'rpc_answer_dropped', msg_id: i64(), seq_no: i32(), bytes: i32() });
const _future_salt: any = () => ({ _: 'future_salt', valid_since: i32(), valid_until: i32(), salt: i64() });
const _future_salts: any = () => ({ _: 'future_salts', req_msg_id: i64(), now: i32(), salts: vector(_future_salt, true) });
const _pong: any = () => ({ _: 'pong', msg_id: i64(), ping_id: i64() });
const _new_session_created: any = () => ({ _: 'new_session_created', first_msg_id: i64(), unique_id: i64(), server_salt: i64() });
const _msg_container: any = () => ({ _: 'msg_container', messages: vector(_message, true) });
const _message: any = () => ({ _: 'message', msg_id: i64(), seqno: i32(), bytes: i32(), body: obj() });
const _msg_copy: any = () => ({ _: 'msg_copy', orig_message: obj() });
const _gzip_packed: any = () => ({ _: 'gzip_packed', packed_data: bytes() });
const _msgs_ack: any = () => ({ _: 'msgs_ack', msg_ids: vector(i64) });
const _bad_msg_notification: any = () => ({ _: 'bad_msg_notification', bad_msg_id: i64(), bad_msg_seqno: i32(), error_code: i32() });
const _bad_server_salt: any = () => ({ _: 'bad_server_salt', bad_msg_id: i64(), bad_msg_seqno: i32(), error_code: i32(), new_server_salt: i64() });
const _msg_resend_req: any = () => ({ _: 'msg_resend_req', msg_ids: vector(i64) });
const _msg_resend_ans_req: any = () => ({ _: 'msg_resend_ans_req', msg_ids: vector(i64) });
const _msgs_state_req: any = () => ({ _: 'msgs_state_req', msg_ids: vector(i64) });
const _msgs_state_info: any = () => ({ _: 'msgs_state_info', req_msg_id: i64(), info: bytes() });
const _msgs_all_info: any = () => ({ _: 'msgs_all_info', msg_ids: vector(i64), info: bytes() });
const _msg_detailed_info: any = () => ({ _: 'msg_detailed_info', msg_id: i64(), answer_msg_id: i64(), bytes: i32(), status: i32() });
const _msg_new_detailed_info: any = () => ({ _: 'msg_new_detailed_info', answer_msg_id: i64(), bytes: i32(), status: i32() });
const _bind_auth_key_inner: any = () => ({ _: 'bind_auth_key_inner', nonce: i64(), temp_auth_key_id: i64(), perm_auth_key_id: i64(), temp_session_id: i64(), expires_at: i32() });
const _destroy_auth_key_ok: any = () => ({ _: 'destroy_auth_key_ok' });
const _destroy_auth_key_none: any = () => ({ _: 'destroy_auth_key_none' });
const _destroy_auth_key_fail: any = () => ({ _: 'destroy_auth_key_fail' });
const _destroy_session_ok: any = () => ({ _: 'destroy_session_ok', session_id: i64() });
const _destroy_session_none: any = () => ({ _: 'destroy_session_none', session_id: i64() });
const _boolFalse = () => false;
const _boolTrue = () => true;
const _true = () => true;
const _error: any = () => ({ _: 'error', code: i32(), text: str() });
const _null = () => null;
const _inputPeerEmpty: any = () => ({ _: 'inputPeerEmpty' });
const _inputPeerSelf: any = () => ({ _: 'inputPeerSelf' });
const _inputPeerChat: any = () => ({ _: 'inputPeerChat', chat_id: i32() });
const _inputUserEmpty: any = () => ({ _: 'inputUserEmpty' });
const _inputUserSelf: any = () => ({ _: 'inputUserSelf' });
const _inputPhoneContact: any = () => ({ _: 'inputPhoneContact', client_id: i64(), phone: str(), first_name: str(), last_name: str() });
const _inputFile: any = () => ({ _: 'inputFile', id: i64(), parts: i32(), name: str(), md5_checksum: str() });
const _inputMediaEmpty: any = () => ({ _: 'inputMediaEmpty' });
const _inputMediaUploadedPhoto = (): any => {
  const flags = i32();
  return {
    _: 'inputMediaUploadedPhoto',
    file: obj(),
    stickers: flags & 0x1 ? vector(obj) : u,
    ttl_seconds: flags & 0x2 ? i32() : u,
  };
};
const _inputMediaPhoto = (): any => {
  const flags = i32();
  return {
    _: 'inputMediaPhoto',
    id: obj(),
    ttl_seconds: flags & 0x1 ? i32() : u,
  };
};
const _inputMediaGeoPoint: any = () => ({ _: 'inputMediaGeoPoint', geo_point: obj() });
const _inputMediaContact: any = () => ({ _: 'inputMediaContact', phone_number: str(), first_name: str(), last_name: str(), vcard: str() });
const _inputChatPhotoEmpty: any = () => ({ _: 'inputChatPhotoEmpty' });
const _inputChatUploadedPhoto: any = () => ({ _: 'inputChatUploadedPhoto', file: obj() });
const _inputChatPhoto: any = () => ({ _: 'inputChatPhoto', id: obj() });
const _inputGeoPointEmpty: any = () => ({ _: 'inputGeoPointEmpty' });
const _inputGeoPoint: any = () => ({ _: 'inputGeoPoint', lat: f64(), long: f64() });
const _inputPhotoEmpty: any = () => ({ _: 'inputPhotoEmpty' });
const _inputPhoto: any = () => ({ _: 'inputPhoto', id: i64(), access_hash: i64(), file_reference: bytes() });
const _inputFileLocation: any = () => ({ _: 'inputFileLocation', volume_id: i64(), local_id: i32(), secret: i64(), file_reference: bytes() });
const _peerUser: any = () => ({ _: 'peerUser', user_id: i32() });
const _peerChat: any = () => ({ _: 'peerChat', chat_id: i32() });
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
const _userProfilePhotoEmpty: any = () => ({ _: 'userProfilePhotoEmpty' });
const _userProfilePhoto: any = () => ({ _: 'userProfilePhoto', photo_id: i64(), photo_small: obj(), photo_big: obj(), dc_id: i32() });
const _userStatusEmpty: any = () => ({ _: 'userStatusEmpty' });
const _userStatusOnline: any = () => ({ _: 'userStatusOnline', expires: i32() });
const _userStatusOffline: any = () => ({ _: 'userStatusOffline', was_online: i32() });
const _chatEmpty: any = () => ({ _: 'chatEmpty', id: i32() });
const _chat = (): any => {
  const flags = i32();
  return {
    _: 'chat',
    creator: !!(flags & 0x1),
    kicked: !!(flags & 0x2),
    left: !!(flags & 0x4),
    deactivated: !!(flags & 0x20),
    id: i32(),
    title: str(),
    photo: obj(),
    participants_count: i32(),
    date: i32(),
    version: i32(),
    migrated_to: flags & 0x40 ? obj() : u,
    admin_rights: flags & 0x4000 ? obj() : u,
    default_banned_rights: flags & 0x40000 ? obj() : u,
  };
};
const _chatForbidden: any = () => ({ _: 'chatForbidden', id: i32(), title: str() });
const _chatFull = (): any => {
  const flags = i32();
  return {
    _: 'chatFull',
    can_set_username: !!(flags & 0x80),
    has_scheduled: !!(flags & 0x100),
    id: i32(),
    about: str(),
    participants: obj(),
    chat_photo: flags & 0x4 ? obj() : u,
    notify_settings: obj(),
    exported_invite: obj(),
    bot_info: flags & 0x8 ? vector(obj) : u,
    pinned_msg_id: flags & 0x40 ? i32() : u,
    folder_id: flags & 0x800 ? i32() : u,
  };
};
const _chatParticipant: any = () => ({ _: 'chatParticipant', user_id: i32(), inviter_id: i32(), date: i32() });
const _chatParticipantsForbidden = (): any => {
  const flags = i32();
  return {
    _: 'chatParticipantsForbidden',
    chat_id: i32(),
    self_participant: flags & 0x1 ? obj() : u,
  };
};
const _chatParticipants: any = () => ({ _: 'chatParticipants', chat_id: i32(), participants: vector(obj), version: i32() });
const _chatPhotoEmpty: any = () => ({ _: 'chatPhotoEmpty' });
const _chatPhoto: any = () => ({ _: 'chatPhoto', photo_small: obj(), photo_big: obj(), dc_id: i32() });
const _messageEmpty: any = () => ({ _: 'messageEmpty', id: i32() });
const _messageService = (): any => {
  const flags = i32();
  return {
    _: 'messageService',
    out: !!(flags & 0x2),
    mentioned: !!(flags & 0x10),
    media_unread: !!(flags & 0x20),
    silent: !!(flags & 0x2000),
    post: !!(flags & 0x4000),
    legacy: !!(flags & 0x80000),
    id: i32(),
    from_id: flags & 0x100 ? i32() : u,
    to_id: obj(),
    reply_to_msg_id: flags & 0x8 ? i32() : u,
    date: i32(),
    action: obj(),
  };
};
const _messageMediaEmpty: any = () => ({ _: 'messageMediaEmpty' });
const _messageMediaPhoto = (): any => {
  const flags = i32();
  return {
    _: 'messageMediaPhoto',
    photo: flags & 0x1 ? obj() : u,
    ttl_seconds: flags & 0x4 ? i32() : u,
  };
};
const _messageMediaGeo: any = () => ({ _: 'messageMediaGeo', geo: obj() });
const _messageMediaContact: any = () => ({ _: 'messageMediaContact', phone_number: str(), first_name: str(), last_name: str(), vcard: str(), user_id: i32() });
const _messageMediaUnsupported: any = () => ({ _: 'messageMediaUnsupported' });
const _messageActionEmpty: any = () => ({ _: 'messageActionEmpty' });
const _messageActionChatCreate: any = () => ({ _: 'messageActionChatCreate', title: str(), users: vector(i32) });
const _messageActionChatEditTitle: any = () => ({ _: 'messageActionChatEditTitle', title: str() });
const _messageActionChatEditPhoto: any = () => ({ _: 'messageActionChatEditPhoto', photo: obj() });
const _messageActionChatDeletePhoto: any = () => ({ _: 'messageActionChatDeletePhoto' });
const _messageActionChatAddUser: any = () => ({ _: 'messageActionChatAddUser', users: vector(i32) });
const _messageActionChatDeleteUser: any = () => ({ _: 'messageActionChatDeleteUser', user_id: i32() });
const _dialog = (): any => {
  const flags = i32();
  return {
    _: 'dialog',
    pinned: !!(flags & 0x4),
    unread_mark: !!(flags & 0x8),
    peer: obj(),
    top_message: i32(),
    read_inbox_max_id: i32(),
    read_outbox_max_id: i32(),
    unread_count: i32(),
    unread_mentions_count: i32(),
    notify_settings: obj(),
    pts: flags & 0x1 ? i32() : u,
    draft: flags & 0x2 ? obj() : u,
    folder_id: flags & 0x10 ? i32() : u,
  };
};
const _photoEmpty: any = () => ({ _: 'photoEmpty', id: i64() });
const _photo = (): any => {
  const flags = i32();
  return {
    _: 'photo',
    has_stickers: !!(flags & 0x1),
    id: i64(),
    access_hash: i64(),
    file_reference: bytes(),
    date: i32(),
    sizes: vector(obj),
    dc_id: i32(),
  };
};
const _photoSizeEmpty: any = () => ({ _: 'photoSizeEmpty', type: str() });
const _photoSize: any = () => ({ _: 'photoSize', type: str(), location: obj(), w: i32(), h: i32(), size: i32() });
const _photoCachedSize: any = () => ({ _: 'photoCachedSize', type: str(), location: obj(), w: i32(), h: i32(), bytes: bytes() });
const _geoPointEmpty: any = () => ({ _: 'geoPointEmpty' });
const _geoPoint: any = () => ({ _: 'geoPoint', long: f64(), lat: f64(), access_hash: i64() });
const _authSentCode = (): any => {
  const flags = i32();
  return {
    _: 'auth.sentCode',
    type: obj(),
    phone_code_hash: str(),
    next_type: flags & 0x2 ? obj() : u,
    timeout: flags & 0x4 ? i32() : u,
  };
};
const _authAuthorization = (): any => {
  const flags = i32();
  return {
    _: 'auth.authorization',
    tmp_sessions: flags & 0x1 ? i32() : u,
    user: obj(),
  };
};
const _authExportedAuthorization: any = () => ({ _: 'auth.exportedAuthorization', id: i32(), bytes: bytes() });
const _inputNotifyPeer: any = () => ({ _: 'inputNotifyPeer', peer: obj() });
const _inputNotifyUsers: any = () => ({ _: 'inputNotifyUsers' });
const _inputNotifyChats: any = () => ({ _: 'inputNotifyChats' });
const _inputPeerNotifySettings = (): any => {
  const flags = i32();
  return {
    _: 'inputPeerNotifySettings',
    show_previews: flags & 0x1 ? obj() : u,
    silent: flags & 0x2 ? obj() : u,
    mute_until: flags & 0x4 ? i32() : u,
    sound: flags & 0x8 ? str() : u,
  };
};
const _peerNotifySettings = (): any => {
  const flags = i32();
  return {
    _: 'peerNotifySettings',
    show_previews: flags & 0x1 ? obj() : u,
    silent: flags & 0x2 ? obj() : u,
    mute_until: flags & 0x4 ? i32() : u,
    sound: flags & 0x8 ? str() : u,
  };
};
const _peerSettings = (): any => {
  const flags = i32();
  return {
    _: 'peerSettings',
    report_spam: !!(flags & 0x1),
    add_contact: !!(flags & 0x2),
    block_contact: !!(flags & 0x4),
    share_contact: !!(flags & 0x8),
    need_contacts_exception: !!(flags & 0x10),
    report_geo: !!(flags & 0x20),
  };
};
const _wallPaper = (): any => {
  const flags = i32();
  return {
    _: 'wallPaper',
    id: i64(),
    creator: !!(flags & 0x1),
    default: !!(flags & 0x2),
    pattern: !!(flags & 0x8),
    dark: !!(flags & 0x10),
    access_hash: i64(),
    slug: str(),
    document: obj(),
    settings: flags & 0x4 ? obj() : u,
  };
};
const _inputReportReasonSpam: any = () => ({ _: 'inputReportReasonSpam' });
const _inputReportReasonViolence: any = () => ({ _: 'inputReportReasonViolence' });
const _inputReportReasonPornography: any = () => ({ _: 'inputReportReasonPornography' });
const _inputReportReasonChildAbuse: any = () => ({ _: 'inputReportReasonChildAbuse' });
const _inputReportReasonOther: any = () => ({ _: 'inputReportReasonOther', text: str() });
const _userFull = (): any => {
  const flags = i32();
  return {
    _: 'userFull',
    blocked: !!(flags & 0x1),
    phone_calls_available: !!(flags & 0x10),
    phone_calls_private: !!(flags & 0x20),
    can_pin_message: !!(flags & 0x80),
    has_scheduled: !!(flags & 0x1000),
    user: obj(),
    about: flags & 0x2 ? str() : u,
    settings: obj(),
    profile_photo: flags & 0x4 ? obj() : u,
    notify_settings: obj(),
    bot_info: flags & 0x8 ? obj() : u,
    pinned_msg_id: flags & 0x40 ? i32() : u,
    common_chats_count: i32(),
    folder_id: flags & 0x800 ? i32() : u,
  };
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
const _messagesMessages: any = () => ({ _: 'messages.messages', messages: vector(obj), chats: vector(obj), users: vector(obj) });
const _messagesMessagesSlice = (): any => {
  const flags = i32();
  return {
    _: 'messages.messagesSlice',
    inexact: !!(flags & 0x2),
    count: i32(),
    next_rate: flags & 0x1 ? i32() : u,
    messages: vector(obj),
    chats: vector(obj),
    users: vector(obj),
  };
};
const _messagesChats: any = () => ({ _: 'messages.chats', chats: vector(obj) });
const _messagesChatFull: any = () => ({ _: 'messages.chatFull', full_chat: obj(), chats: vector(obj), users: vector(obj) });
const _messagesAffectedHistory: any = () => ({ _: 'messages.affectedHistory', pts: i32(), pts_count: i32(), offset: i32() });
const _inputMessagesFilterEmpty: any = () => ({ _: 'inputMessagesFilterEmpty' });
const _inputMessagesFilterPhotos: any = () => ({ _: 'inputMessagesFilterPhotos' });
const _inputMessagesFilterVideo: any = () => ({ _: 'inputMessagesFilterVideo' });
const _inputMessagesFilterPhotoVideo: any = () => ({ _: 'inputMessagesFilterPhotoVideo' });
const _inputMessagesFilterDocument: any = () => ({ _: 'inputMessagesFilterDocument' });
const _inputMessagesFilterUrl: any = () => ({ _: 'inputMessagesFilterUrl' });
const _inputMessagesFilterGif: any = () => ({ _: 'inputMessagesFilterGif' });
const _updateNewMessage: any = () => ({ _: 'updateNewMessage', message: obj(), pts: i32(), pts_count: i32() });
const _updateMessageID: any = () => ({ _: 'updateMessageID', id: i32(), random_id: i64() });
const _updateDeleteMessages: any = () => ({ _: 'updateDeleteMessages', messages: vector(i32), pts: i32(), pts_count: i32() });
const _updateUserTyping: any = () => ({ _: 'updateUserTyping', user_id: i32(), action: obj() });
const _updateChatUserTyping: any = () => ({ _: 'updateChatUserTyping', chat_id: i32(), user_id: i32(), action: obj() });
const _updateChatParticipants: any = () => ({ _: 'updateChatParticipants', participants: obj() });
const _updateUserStatus: any = () => ({ _: 'updateUserStatus', user_id: i32(), status: obj() });
const _updateUserName: any = () => ({ _: 'updateUserName', user_id: i32(), first_name: str(), last_name: str(), username: str() });
const _updateUserPhoto: any = () => ({ _: 'updateUserPhoto', user_id: i32(), date: i32(), photo: obj(), previous: obj() });
const _updatesState: any = () => ({ _: 'updates.state', pts: i32(), qts: i32(), date: i32(), seq: i32(), unread_count: i32() });
const _updatesDifferenceEmpty: any = () => ({ _: 'updates.differenceEmpty', date: i32(), seq: i32() });
const _updatesDifference: any = () => ({ _: 'updates.difference', new_messages: vector(obj), new_encrypted_messages: vector(obj), other_updates: vector(obj), chats: vector(obj), users: vector(obj), state: obj() });
const _updatesDifferenceSlice: any = () => ({ _: 'updates.differenceSlice', new_messages: vector(obj), new_encrypted_messages: vector(obj), other_updates: vector(obj), chats: vector(obj), users: vector(obj), intermediate_state: obj() });
const _updatesTooLong: any = () => ({ _: 'updatesTooLong' });
const _updateShortMessage = (): any => {
  const flags = i32();
  return {
    _: 'updateShortMessage',
    out: !!(flags & 0x2),
    mentioned: !!(flags & 0x10),
    media_unread: !!(flags & 0x20),
    silent: !!(flags & 0x2000),
    id: i32(),
    user_id: i32(),
    message: str(),
    pts: i32(),
    pts_count: i32(),
    date: i32(),
    fwd_from: flags & 0x4 ? obj() : u,
    via_bot_id: flags & 0x800 ? i32() : u,
    reply_to_msg_id: flags & 0x8 ? i32() : u,
    entities: flags & 0x80 ? vector(obj) : u,
  };
};
const _updateShortChatMessage = (): any => {
  const flags = i32();
  return {
    _: 'updateShortChatMessage',
    out: !!(flags & 0x2),
    mentioned: !!(flags & 0x10),
    media_unread: !!(flags & 0x20),
    silent: !!(flags & 0x2000),
    id: i32(),
    from_id: i32(),
    chat_id: i32(),
    message: str(),
    pts: i32(),
    pts_count: i32(),
    date: i32(),
    fwd_from: flags & 0x4 ? obj() : u,
    via_bot_id: flags & 0x800 ? i32() : u,
    reply_to_msg_id: flags & 0x8 ? i32() : u,
    entities: flags & 0x80 ? vector(obj) : u,
  };
};
const _updateShort: any = () => ({ _: 'updateShort', update: obj(), date: i32() });
const _updatesCombined: any = () => ({ _: 'updatesCombined', updates: vector(obj), users: vector(obj), chats: vector(obj), date: i32(), seq_start: i32(), seq: i32() });
const _updates: any = () => ({ _: 'updates', updates: vector(obj), users: vector(obj), chats: vector(obj), date: i32(), seq: i32() });
const _photosPhotos: any = () => ({ _: 'photos.photos', photos: vector(obj), users: vector(obj) });
const _photosPhotosSlice: any = () => ({ _: 'photos.photosSlice', count: i32(), photos: vector(obj), users: vector(obj) });
const _photosPhoto: any = () => ({ _: 'photos.photo', photo: obj(), users: vector(obj) });
const _uploadFile: any = () => ({ _: 'upload.file', type: obj(), mtime: i32(), bytes: bytes() });
const _dcOption = (): any => {
  const flags = i32();
  return {
    _: 'dcOption',
    ipv6: !!(flags & 0x1),
    media_only: !!(flags & 0x2),
    tcpo_only: !!(flags & 0x4),
    cdn: !!(flags & 0x8),
    static: !!(flags & 0x10),
    id: i32(),
    ip_address: str(),
    port: i32(),
    secret: flags & 0x400 ? bytes() : u,
  };
};
const _config = (): any => {
  const flags = i32();
  return {
    _: 'config',
    phonecalls_enabled: !!(flags & 0x2),
    default_p2p_contacts: !!(flags & 0x8),
    preload_featured_stickers: !!(flags & 0x10),
    ignore_phone_entities: !!(flags & 0x20),
    revoke_pm_inbox: !!(flags & 0x40),
    blocked_mode: !!(flags & 0x100),
    pfs_enabled: !!(flags & 0x2000),
    date: i32(),
    expires: i32(),
    test_mode: obj(),
    this_dc: i32(),
    dc_options: vector(obj),
    dc_txt_domain_name: str(),
    chat_size_max: i32(),
    megagroup_size_max: i32(),
    forwarded_count_max: i32(),
    online_update_period_ms: i32(),
    offline_blur_timeout_ms: i32(),
    offline_idle_timeout_ms: i32(),
    online_cloud_timeout_ms: i32(),
    notify_cloud_delay_ms: i32(),
    notify_default_delay_ms: i32(),
    push_chat_period_ms: i32(),
    push_chat_limit: i32(),
    saved_gifs_limit: i32(),
    edit_time_limit: i32(),
    revoke_time_limit: i32(),
    revoke_pm_time_limit: i32(),
    rating_e_decay: i32(),
    stickers_recent_limit: i32(),
    stickers_faved_limit: i32(),
    channels_read_media_period: i32(),
    tmp_sessions: flags & 0x1 ? i32() : u,
    pinned_dialogs_count_max: i32(),
    pinned_infolder_count_max: i32(),
    call_receive_timeout_ms: i32(),
    call_ring_timeout_ms: i32(),
    call_connect_timeout_ms: i32(),
    call_packet_timeout_ms: i32(),
    me_url_prefix: str(),
    autoupdate_url_prefix: flags & 0x80 ? str() : u,
    gif_search_username: flags & 0x200 ? str() : u,
    venue_search_username: flags & 0x400 ? str() : u,
    img_search_username: flags & 0x800 ? str() : u,
    static_maps_provider: flags & 0x1000 ? str() : u,
    caption_length_max: i32(),
    message_length_max: i32(),
    webfile_dc_id: i32(),
    suggested_lang_code: flags & 0x4 ? str() : u,
    lang_pack_version: flags & 0x4 ? i32() : u,
    base_lang_pack_version: flags & 0x4 ? i32() : u,
  };
};
const _nearestDc: any = () => ({ _: 'nearestDc', country: str(), this_dc: i32(), nearest_dc: i32() });
const _helpAppUpdate = (): any => {
  const flags = i32();
  return {
    _: 'help.appUpdate',
    can_not_skip: !!(flags & 0x1),
    id: i32(),
    version: str(),
    text: str(),
    entities: vector(obj),
    document: flags & 0x2 ? obj() : u,
    url: flags & 0x4 ? str() : u,
  };
};
const _helpNoAppUpdate: any = () => ({ _: 'help.noAppUpdate' });
const _helpInviteText: any = () => ({ _: 'help.inviteText', message: str() });
const _updateNewEncryptedMessage: any = () => ({ _: 'updateNewEncryptedMessage', message: obj(), qts: i32() });
const _updateEncryptedChatTyping: any = () => ({ _: 'updateEncryptedChatTyping', chat_id: i32() });
const _updateEncryption: any = () => ({ _: 'updateEncryption', chat: obj(), date: i32() });
const _updateEncryptedMessagesRead: any = () => ({ _: 'updateEncryptedMessagesRead', chat_id: i32(), max_date: i32(), date: i32() });
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
const _inputEncryptedFileLocation: any = () => ({ _: 'inputEncryptedFileLocation', id: i64(), access_hash: i64() });
const _encryptedMessage: any = () => ({ _: 'encryptedMessage', random_id: i64(), chat_id: i32(), date: i32(), bytes: bytes(), file: obj() });
const _encryptedMessageService: any = () => ({ _: 'encryptedMessageService', random_id: i64(), chat_id: i32(), date: i32(), bytes: bytes() });
const _messagesDhConfigNotModified: any = () => ({ _: 'messages.dhConfigNotModified', random: bytes() });
const _messagesDhConfig: any = () => ({ _: 'messages.dhConfig', g: i32(), p: bytes(), version: i32(), random: bytes() });
const _messagesSentEncryptedMessage: any = () => ({ _: 'messages.sentEncryptedMessage', date: i32() });
const _messagesSentEncryptedFile: any = () => ({ _: 'messages.sentEncryptedFile', date: i32(), file: obj() });
const _inputFileBig: any = () => ({ _: 'inputFileBig', id: i64(), parts: i32(), name: str() });
const _inputEncryptedFileBigUploaded: any = () => ({ _: 'inputEncryptedFileBigUploaded', id: i64(), parts: i32(), key_fingerprint: i32() });
const _updateChatParticipantAdd: any = () => ({ _: 'updateChatParticipantAdd', chat_id: i32(), user_id: i32(), inviter_id: i32(), date: i32(), version: i32() });
const _updateChatParticipantDelete: any = () => ({ _: 'updateChatParticipantDelete', chat_id: i32(), user_id: i32(), version: i32() });
const _updateDcOptions: any = () => ({ _: 'updateDcOptions', dc_options: vector(obj) });
const _inputMediaUploadedDocument = (): any => {
  const flags = i32();
  return {
    _: 'inputMediaUploadedDocument',
    nosound_video: !!(flags & 0x8),
    file: obj(),
    thumb: flags & 0x4 ? obj() : u,
    mime_type: str(),
    attributes: vector(obj),
    stickers: flags & 0x1 ? vector(obj) : u,
    ttl_seconds: flags & 0x2 ? i32() : u,
  };
};
const _inputMediaDocument = (): any => {
  const flags = i32();
  return {
    _: 'inputMediaDocument',
    id: obj(),
    ttl_seconds: flags & 0x1 ? i32() : u,
  };
};
const _messageMediaDocument = (): any => {
  const flags = i32();
  return {
    _: 'messageMediaDocument',
    document: flags & 0x1 ? obj() : u,
    ttl_seconds: flags & 0x4 ? i32() : u,
  };
};
const _inputDocumentEmpty: any = () => ({ _: 'inputDocumentEmpty' });
const _inputDocument: any = () => ({ _: 'inputDocument', id: i64(), access_hash: i64(), file_reference: bytes() });
const _inputDocumentFileLocation: any = () => ({ _: 'inputDocumentFileLocation', id: i64(), access_hash: i64(), file_reference: bytes(), thumb_size: str() });
const _documentEmpty: any = () => ({ _: 'documentEmpty', id: i64() });
const _document = (): any => {
  const flags = i32();
  return {
    _: 'document',
    id: i64(),
    access_hash: i64(),
    file_reference: bytes(),
    date: i32(),
    mime_type: str(),
    size: i32(),
    thumbs: flags & 0x1 ? vector(obj) : u,
    dc_id: i32(),
    attributes: vector(obj),
  };
};
const _helpSupport: any = () => ({ _: 'help.support', phone_number: str(), user: obj() });
const _notifyPeer: any = () => ({ _: 'notifyPeer', peer: obj() });
const _notifyUsers: any = () => ({ _: 'notifyUsers' });
const _notifyChats: any = () => ({ _: 'notifyChats' });
const _updateUserBlocked: any = () => ({ _: 'updateUserBlocked', user_id: i32(), blocked: obj() });
const _updateNotifySettings: any = () => ({ _: 'updateNotifySettings', peer: obj(), notify_settings: obj() });
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
const _contactsFound: any = () => ({ _: 'contacts.found', my_results: vector(obj), results: vector(obj), chats: vector(obj), users: vector(obj) });
const _updateServiceNotification = (): any => {
  const flags = i32();
  return {
    _: 'updateServiceNotification',
    popup: !!(flags & 0x1),
    inbox_date: flags & 0x2 ? i32() : u,
    type: str(),
    message: str(),
    media: obj(),
    entities: vector(obj),
  };
};
const _userStatusRecently: any = () => ({ _: 'userStatusRecently' });
const _userStatusLastWeek: any = () => ({ _: 'userStatusLastWeek' });
const _userStatusLastMonth: any = () => ({ _: 'userStatusLastMonth' });
const _updatePrivacy: any = () => ({ _: 'updatePrivacy', key: obj(), rules: vector(obj) });
const _inputPrivacyKeyStatusTimestamp: any = () => ({ _: 'inputPrivacyKeyStatusTimestamp' });
const _privacyKeyStatusTimestamp: any = () => ({ _: 'privacyKeyStatusTimestamp' });
const _inputPrivacyValueAllowContacts: any = () => ({ _: 'inputPrivacyValueAllowContacts' });
const _inputPrivacyValueAllowAll: any = () => ({ _: 'inputPrivacyValueAllowAll' });
const _inputPrivacyValueAllowUsers: any = () => ({ _: 'inputPrivacyValueAllowUsers', users: vector(obj) });
const _inputPrivacyValueDisallowContacts: any = () => ({ _: 'inputPrivacyValueDisallowContacts' });
const _inputPrivacyValueDisallowAll: any = () => ({ _: 'inputPrivacyValueDisallowAll' });
const _inputPrivacyValueDisallowUsers: any = () => ({ _: 'inputPrivacyValueDisallowUsers', users: vector(obj) });
const _privacyValueAllowContacts: any = () => ({ _: 'privacyValueAllowContacts' });
const _privacyValueAllowAll: any = () => ({ _: 'privacyValueAllowAll' });
const _privacyValueAllowUsers: any = () => ({ _: 'privacyValueAllowUsers', users: vector(i32) });
const _privacyValueDisallowContacts: any = () => ({ _: 'privacyValueDisallowContacts' });
const _privacyValueDisallowAll: any = () => ({ _: 'privacyValueDisallowAll' });
const _privacyValueDisallowUsers: any = () => ({ _: 'privacyValueDisallowUsers', users: vector(i32) });
const _accountPrivacyRules: any = () => ({ _: 'account.privacyRules', rules: vector(obj), chats: vector(obj), users: vector(obj) });
const _accountDaysTTL: any = () => ({ _: 'accountDaysTTL', days: i32() });
const _updateUserPhone: any = () => ({ _: 'updateUserPhone', user_id: i32(), phone: str() });
const _documentAttributeImageSize: any = () => ({ _: 'documentAttributeImageSize', w: i32(), h: i32() });
const _documentAttributeAnimated: any = () => ({ _: 'documentAttributeAnimated' });
const _documentAttributeSticker = (): any => {
  const flags = i32();
  return {
    _: 'documentAttributeSticker',
    mask: !!(flags & 0x2),
    alt: str(),
    stickerset: obj(),
    mask_coords: flags & 0x1 ? obj() : u,
  };
};
const _documentAttributeVideo = (): any => {
  const flags = i32();
  return {
    _: 'documentAttributeVideo',
    round_message: !!(flags & 0x1),
    supports_streaming: !!(flags & 0x2),
    duration: i32(),
    w: i32(),
    h: i32(),
  };
};
const _documentAttributeAudio = (): any => {
  const flags = i32();
  return {
    _: 'documentAttributeAudio',
    voice: !!(flags & 0x400),
    duration: i32(),
    title: flags & 0x1 ? str() : u,
    performer: flags & 0x2 ? str() : u,
    waveform: flags & 0x4 ? bytes() : u,
  };
};
const _documentAttributeFilename: any = () => ({ _: 'documentAttributeFilename', file_name: str() });
const _messagesStickersNotModified: any = () => ({ _: 'messages.stickersNotModified' });
const _messagesStickers: any = () => ({ _: 'messages.stickers', hash: i32(), stickers: vector(obj) });
const _stickerPack: any = () => ({ _: 'stickerPack', emoticon: str(), documents: vector(i64) });
const _messagesAllStickersNotModified: any = () => ({ _: 'messages.allStickersNotModified' });
const _messagesAllStickers: any = () => ({ _: 'messages.allStickers', hash: i32(), sets: vector(obj) });
const _updateReadHistoryInbox = (): any => {
  const flags = i32();
  return {
    _: 'updateReadHistoryInbox',
    folder_id: flags & 0x1 ? i32() : u,
    peer: obj(),
    max_id: i32(),
    still_unread_count: i32(),
    pts: i32(),
    pts_count: i32(),
  };
};
const _updateReadHistoryOutbox: any = () => ({ _: 'updateReadHistoryOutbox', peer: obj(), max_id: i32(), pts: i32(), pts_count: i32() });
const _messagesAffectedMessages: any = () => ({ _: 'messages.affectedMessages', pts: i32(), pts_count: i32() });
const _updateWebPage: any = () => ({ _: 'updateWebPage', webpage: obj(), pts: i32(), pts_count: i32() });
const _webPageEmpty: any = () => ({ _: 'webPageEmpty', id: i64() });
const _webPagePending: any = () => ({ _: 'webPagePending', id: i64(), date: i32() });
const _webPage = (): any => {
  const flags = i32();
  return {
    _: 'webPage',
    id: i64(),
    url: str(),
    display_url: str(),
    hash: i32(),
    type: flags & 0x1 ? str() : u,
    site_name: flags & 0x2 ? str() : u,
    title: flags & 0x4 ? str() : u,
    description: flags & 0x8 ? str() : u,
    photo: flags & 0x10 ? obj() : u,
    embed_url: flags & 0x20 ? str() : u,
    embed_type: flags & 0x20 ? str() : u,
    embed_width: flags & 0x40 ? i32() : u,
    embed_height: flags & 0x40 ? i32() : u,
    duration: flags & 0x80 ? i32() : u,
    author: flags & 0x100 ? str() : u,
    document: flags & 0x200 ? obj() : u,
    documents: flags & 0x800 ? vector(obj) : u,
    cached_page: flags & 0x400 ? obj() : u,
  };
};
const _messageMediaWebPage: any = () => ({ _: 'messageMediaWebPage', webpage: obj() });
const _authorization = (): any => {
  const flags = i32();
  return {
    _: 'authorization',
    current: !!(flags & 0x1),
    official_app: !!(flags & 0x2),
    password_pending: !!(flags & 0x4),
    hash: i64(),
    device_model: str(),
    platform: str(),
    system_version: str(),
    api_id: i32(),
    app_name: str(),
    app_version: str(),
    date_created: i32(),
    date_active: i32(),
    ip: str(),
    country: str(),
    region: str(),
  };
};
const _accountAuthorizations: any = () => ({ _: 'account.authorizations', authorizations: vector(obj) });
const _accountPassword = (): any => {
  const flags = i32();
  return {
    _: 'account.password',
    has_recovery: !!(flags & 0x1),
    has_secure_values: !!(flags & 0x2),
    has_password: !!(flags & 0x4),
    current_algo: flags & 0x4 ? obj() : u,
    srp_B: flags & 0x4 ? bytes() : u,
    srp_id: flags & 0x4 ? i64() : u,
    hint: flags & 0x8 ? str() : u,
    email_unconfirmed_pattern: flags & 0x10 ? str() : u,
    new_algo: obj(),
    new_secure_algo: obj(),
    secure_random: bytes(),
  };
};
const _accountPasswordSettings = (): any => {
  const flags = i32();
  return {
    _: 'account.passwordSettings',
    email: flags & 0x1 ? str() : u,
    secure_settings: flags & 0x2 ? obj() : u,
  };
};
const _accountPasswordInputSettings = (): any => {
  const flags = i32();
  return {
    _: 'account.passwordInputSettings',
    new_algo: flags & 0x1 ? obj() : u,
    new_password_hash: flags & 0x1 ? bytes() : u,
    hint: flags & 0x1 ? str() : u,
    email: flags & 0x2 ? str() : u,
    new_secure_settings: flags & 0x4 ? obj() : u,
  };
};
const _authPasswordRecovery: any = () => ({ _: 'auth.passwordRecovery', email_pattern: str() });
const _inputMediaVenue: any = () => ({ _: 'inputMediaVenue', geo_point: obj(), title: str(), address: str(), provider: str(), venue_id: str(), venue_type: str() });
const _messageMediaVenue: any = () => ({ _: 'messageMediaVenue', geo: obj(), title: str(), address: str(), provider: str(), venue_id: str(), venue_type: str() });
const _receivedNotifyMessage: any = () => ({ _: 'receivedNotifyMessage', id: i32(), flags: i32() });
const _chatInviteEmpty: any = () => ({ _: 'chatInviteEmpty' });
const _chatInviteExported: any = () => ({ _: 'chatInviteExported', link: str() });
const _chatInviteAlready: any = () => ({ _: 'chatInviteAlready', chat: obj() });
const _chatInvite = (): any => {
  const flags = i32();
  return {
    _: 'chatInvite',
    channel: !!(flags & 0x1),
    broadcast: !!(flags & 0x2),
    public: !!(flags & 0x4),
    megagroup: !!(flags & 0x8),
    title: str(),
    photo: obj(),
    participants_count: i32(),
    participants: flags & 0x10 ? vector(obj) : u,
  };
};
const _messageActionChatJoinedByLink: any = () => ({ _: 'messageActionChatJoinedByLink', inviter_id: i32() });
const _updateReadMessagesContents: any = () => ({ _: 'updateReadMessagesContents', messages: vector(i32), pts: i32(), pts_count: i32() });
const _inputStickerSetEmpty: any = () => ({ _: 'inputStickerSetEmpty' });
const _inputStickerSetID: any = () => ({ _: 'inputStickerSetID', id: i64(), access_hash: i64() });
const _inputStickerSetShortName: any = () => ({ _: 'inputStickerSetShortName', short_name: str() });
const _stickerSet = (): any => {
  const flags = i32();
  return {
    _: 'stickerSet',
    archived: !!(flags & 0x2),
    official: !!(flags & 0x4),
    masks: !!(flags & 0x8),
    animated: !!(flags & 0x20),
    installed_date: flags & 0x1 ? i32() : u,
    id: i64(),
    access_hash: i64(),
    title: str(),
    short_name: str(),
    thumb: flags & 0x10 ? obj() : u,
    thumb_dc_id: flags & 0x10 ? i32() : u,
    count: i32(),
    hash: i32(),
  };
};
const _messagesStickerSet: any = () => ({ _: 'messages.stickerSet', set: obj(), packs: vector(obj), documents: vector(obj) });
const _user = (): any => {
  const flags = i32();
  return {
    _: 'user',
    self: !!(flags & 0x400),
    contact: !!(flags & 0x800),
    mutual_contact: !!(flags & 0x1000),
    deleted: !!(flags & 0x2000),
    bot: !!(flags & 0x4000),
    bot_chat_history: !!(flags & 0x8000),
    bot_nochats: !!(flags & 0x10000),
    verified: !!(flags & 0x20000),
    restricted: !!(flags & 0x40000),
    min: !!(flags & 0x100000),
    bot_inline_geo: !!(flags & 0x200000),
    support: !!(flags & 0x800000),
    scam: !!(flags & 0x1000000),
    id: i32(),
    access_hash: flags & 0x1 ? i64() : u,
    first_name: flags & 0x2 ? str() : u,
    last_name: flags & 0x4 ? str() : u,
    username: flags & 0x8 ? str() : u,
    phone: flags & 0x10 ? str() : u,
    photo: flags & 0x20 ? obj() : u,
    status: flags & 0x40 ? obj() : u,
    bot_info_version: flags & 0x4000 ? i32() : u,
    restriction_reason: flags & 0x40000 ? vector(obj) : u,
    bot_inline_placeholder: flags & 0x80000 ? str() : u,
    lang_code: flags & 0x400000 ? str() : u,
  };
};
const _botCommand: any = () => ({ _: 'botCommand', command: str(), description: str() });
const _botInfo: any = () => ({ _: 'botInfo', user_id: i32(), description: str(), commands: vector(obj) });
const _keyboardButton: any = () => ({ _: 'keyboardButton', text: str() });
const _keyboardButtonRow: any = () => ({ _: 'keyboardButtonRow', buttons: vector(obj) });
const _replyKeyboardHide = (): any => {
  const flags = i32();
  return {
    _: 'replyKeyboardHide',
    selective: !!(flags & 0x4),
  };
};
const _replyKeyboardForceReply = (): any => {
  const flags = i32();
  return {
    _: 'replyKeyboardForceReply',
    single_use: !!(flags & 0x2),
    selective: !!(flags & 0x4),
  };
};
const _replyKeyboardMarkup = (): any => {
  const flags = i32();
  return {
    _: 'replyKeyboardMarkup',
    resize: !!(flags & 0x1),
    single_use: !!(flags & 0x2),
    selective: !!(flags & 0x4),
    rows: vector(obj),
  };
};
const _inputPeerUser: any = () => ({ _: 'inputPeerUser', user_id: i32(), access_hash: i64() });
const _inputUser: any = () => ({ _: 'inputUser', user_id: i32(), access_hash: i64() });
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
const _updateShortSentMessage = (): any => {
  const flags = i32();
  return {
    _: 'updateShortSentMessage',
    out: !!(flags & 0x2),
    id: i32(),
    pts: i32(),
    pts_count: i32(),
    date: i32(),
    media: flags & 0x200 ? obj() : u,
    entities: flags & 0x80 ? vector(obj) : u,
  };
};
const _inputChannelEmpty: any = () => ({ _: 'inputChannelEmpty' });
const _inputChannel: any = () => ({ _: 'inputChannel', channel_id: i32(), access_hash: i64() });
const _peerChannel: any = () => ({ _: 'peerChannel', channel_id: i32() });
const _inputPeerChannel: any = () => ({ _: 'inputPeerChannel', channel_id: i32(), access_hash: i64() });
const _channel = (): any => {
  const flags = i32();
  return {
    _: 'channel',
    creator: !!(flags & 0x1),
    left: !!(flags & 0x4),
    broadcast: !!(flags & 0x20),
    verified: !!(flags & 0x80),
    megagroup: !!(flags & 0x100),
    restricted: !!(flags & 0x200),
    signatures: !!(flags & 0x800),
    min: !!(flags & 0x1000),
    scam: !!(flags & 0x80000),
    has_link: !!(flags & 0x100000),
    has_geo: !!(flags & 0x200000),
    slowmode_enabled: !!(flags & 0x400000),
    id: i32(),
    access_hash: flags & 0x2000 ? i64() : u,
    title: str(),
    username: flags & 0x40 ? str() : u,
    photo: obj(),
    date: i32(),
    version: i32(),
    restriction_reason: flags & 0x200 ? vector(obj) : u,
    admin_rights: flags & 0x4000 ? obj() : u,
    banned_rights: flags & 0x8000 ? obj() : u,
    default_banned_rights: flags & 0x40000 ? obj() : u,
    participants_count: flags & 0x20000 ? i32() : u,
  };
};
const _channelForbidden = (): any => {
  const flags = i32();
  return {
    _: 'channelForbidden',
    broadcast: !!(flags & 0x20),
    megagroup: !!(flags & 0x100),
    id: i32(),
    access_hash: i64(),
    title: str(),
    until_date: flags & 0x10000 ? i32() : u,
  };
};
const _contactsResolvedPeer: any = () => ({ _: 'contacts.resolvedPeer', peer: obj(), chats: vector(obj), users: vector(obj) });
const _channelFull = (): any => {
  const flags = i32();
  return {
    _: 'channelFull',
    can_view_participants: !!(flags & 0x8),
    can_set_username: !!(flags & 0x40),
    can_set_stickers: !!(flags & 0x80),
    hidden_prehistory: !!(flags & 0x400),
    can_view_stats: !!(flags & 0x1000),
    can_set_location: !!(flags & 0x10000),
    has_scheduled: !!(flags & 0x80000),
    id: i32(),
    about: str(),
    participants_count: flags & 0x1 ? i32() : u,
    admins_count: flags & 0x2 ? i32() : u,
    kicked_count: flags & 0x4 ? i32() : u,
    banned_count: flags & 0x4 ? i32() : u,
    online_count: flags & 0x2000 ? i32() : u,
    read_inbox_max_id: i32(),
    read_outbox_max_id: i32(),
    unread_count: i32(),
    chat_photo: obj(),
    notify_settings: obj(),
    exported_invite: obj(),
    bot_info: vector(obj),
    migrated_from_chat_id: flags & 0x10 ? i32() : u,
    migrated_from_max_id: flags & 0x10 ? i32() : u,
    pinned_msg_id: flags & 0x20 ? i32() : u,
    stickerset: flags & 0x100 ? obj() : u,
    available_min_id: flags & 0x200 ? i32() : u,
    folder_id: flags & 0x800 ? i32() : u,
    linked_chat_id: flags & 0x4000 ? i32() : u,
    location: flags & 0x8000 ? obj() : u,
    slowmode_seconds: flags & 0x20000 ? i32() : u,
    slowmode_next_send_date: flags & 0x40000 ? i32() : u,
    pts: i32(),
  };
};
const _messageRange: any = () => ({ _: 'messageRange', min_id: i32(), max_id: i32() });
const _messagesChannelMessages = (): any => {
  const flags = i32();
  return {
    _: 'messages.channelMessages',
    inexact: !!(flags & 0x2),
    pts: i32(),
    count: i32(),
    messages: vector(obj),
    chats: vector(obj),
    users: vector(obj),
  };
};
const _messageActionChannelCreate: any = () => ({ _: 'messageActionChannelCreate', title: str() });
const _updateChannelTooLong = (): any => {
  const flags = i32();
  return {
    _: 'updateChannelTooLong',
    channel_id: i32(),
    pts: flags & 0x1 ? i32() : u,
  };
};
const _updateChannel: any = () => ({ _: 'updateChannel', channel_id: i32() });
const _updateNewChannelMessage: any = () => ({ _: 'updateNewChannelMessage', message: obj(), pts: i32(), pts_count: i32() });
const _updateReadChannelInbox = (): any => {
  const flags = i32();
  return {
    _: 'updateReadChannelInbox',
    folder_id: flags & 0x1 ? i32() : u,
    channel_id: i32(),
    max_id: i32(),
    still_unread_count: i32(),
    pts: i32(),
  };
};
const _updateDeleteChannelMessages: any = () => ({ _: 'updateDeleteChannelMessages', channel_id: i32(), messages: vector(i32), pts: i32(), pts_count: i32() });
const _updateChannelMessageViews: any = () => ({ _: 'updateChannelMessageViews', channel_id: i32(), id: i32(), views: i32() });
const _updatesChannelDifferenceEmpty = (): any => {
  const flags = i32();
  return {
    _: 'updates.channelDifferenceEmpty',
    final: !!(flags & 0x1),
    pts: i32(),
    timeout: flags & 0x2 ? i32() : u,
  };
};
const _updatesChannelDifferenceTooLong = (): any => {
  const flags = i32();
  return {
    _: 'updates.channelDifferenceTooLong',
    final: !!(flags & 0x1),
    timeout: flags & 0x2 ? i32() : u,
    dialog: obj(),
    messages: vector(obj),
    chats: vector(obj),
    users: vector(obj),
  };
};
const _updatesChannelDifference = (): any => {
  const flags = i32();
  return {
    _: 'updates.channelDifference',
    final: !!(flags & 0x1),
    pts: i32(),
    timeout: flags & 0x2 ? i32() : u,
    new_messages: vector(obj),
    other_updates: vector(obj),
    chats: vector(obj),
    users: vector(obj),
  };
};
const _channelMessagesFilterEmpty: any = () => ({ _: 'channelMessagesFilterEmpty' });
const _channelMessagesFilter = (): any => {
  const flags = i32();
  return {
    _: 'channelMessagesFilter',
    exclude_new_messages: !!(flags & 0x2),
    ranges: vector(obj),
  };
};
const _channelParticipant: any = () => ({ _: 'channelParticipant', user_id: i32(), date: i32() });
const _channelParticipantSelf: any = () => ({ _: 'channelParticipantSelf', user_id: i32(), inviter_id: i32(), date: i32() });
const _channelParticipantCreator = (): any => {
  const flags = i32();
  return {
    _: 'channelParticipantCreator',
    user_id: i32(),
    rank: flags & 0x1 ? str() : u,
  };
};
const _channelParticipantsRecent: any = () => ({ _: 'channelParticipantsRecent' });
const _channelParticipantsAdmins: any = () => ({ _: 'channelParticipantsAdmins' });
const _channelParticipantsKicked: any = () => ({ _: 'channelParticipantsKicked', q: str() });
const _channelsChannelParticipants: any = () => ({ _: 'channels.channelParticipants', count: i32(), participants: vector(obj), users: vector(obj) });
const _channelsChannelParticipant: any = () => ({ _: 'channels.channelParticipant', participant: obj(), users: vector(obj) });
const _chatParticipantCreator: any = () => ({ _: 'chatParticipantCreator', user_id: i32() });
const _chatParticipantAdmin: any = () => ({ _: 'chatParticipantAdmin', user_id: i32(), inviter_id: i32(), date: i32() });
const _updateChatParticipantAdmin: any = () => ({ _: 'updateChatParticipantAdmin', chat_id: i32(), user_id: i32(), is_admin: obj(), version: i32() });
const _messageActionChatMigrateTo: any = () => ({ _: 'messageActionChatMigrateTo', channel_id: i32() });
const _messageActionChannelMigrateFrom: any = () => ({ _: 'messageActionChannelMigrateFrom', title: str(), chat_id: i32() });
const _channelParticipantsBots: any = () => ({ _: 'channelParticipantsBots' });
const _helpTermsOfService = (): any => {
  const flags = i32();
  return {
    _: 'help.termsOfService',
    popup: !!(flags & 0x1),
    id: obj(),
    text: str(),
    entities: vector(obj),
    min_age_confirm: flags & 0x2 ? i32() : u,
  };
};
const _updateNewStickerSet: any = () => ({ _: 'updateNewStickerSet', stickerset: obj() });
const _updateStickerSetsOrder = (): any => {
  const flags = i32();
  return {
    _: 'updateStickerSetsOrder',
    masks: !!(flags & 0x1),
    order: vector(i64),
  };
};
const _updateStickerSets: any = () => ({ _: 'updateStickerSets' });
const _foundGif: any = () => ({ _: 'foundGif', url: str(), thumb_url: str(), content_url: str(), content_type: str(), w: i32(), h: i32() });
const _foundGifCached: any = () => ({ _: 'foundGifCached', url: str(), photo: obj(), document: obj() });
const _inputMediaGifExternal: any = () => ({ _: 'inputMediaGifExternal', url: str(), q: str() });
const _messagesFoundGifs: any = () => ({ _: 'messages.foundGifs', next_offset: i32(), results: vector(obj) });
const _messagesSavedGifsNotModified: any = () => ({ _: 'messages.savedGifsNotModified' });
const _messagesSavedGifs: any = () => ({ _: 'messages.savedGifs', hash: i32(), gifs: vector(obj) });
const _updateSavedGifs: any = () => ({ _: 'updateSavedGifs' });
const _inputBotInlineMessageMediaAuto = (): any => {
  const flags = i32();
  return {
    _: 'inputBotInlineMessageMediaAuto',
    message: str(),
    entities: flags & 0x2 ? vector(obj) : u,
    reply_markup: flags & 0x4 ? obj() : u,
  };
};
const _inputBotInlineMessageText = (): any => {
  const flags = i32();
  return {
    _: 'inputBotInlineMessageText',
    no_webpage: !!(flags & 0x1),
    message: str(),
    entities: flags & 0x2 ? vector(obj) : u,
    reply_markup: flags & 0x4 ? obj() : u,
  };
};
const _inputBotInlineResult = (): any => {
  const flags = i32();
  return {
    _: 'inputBotInlineResult',
    id: str(),
    type: str(),
    title: flags & 0x2 ? str() : u,
    description: flags & 0x4 ? str() : u,
    url: flags & 0x8 ? str() : u,
    thumb: flags & 0x10 ? obj() : u,
    content: flags & 0x20 ? obj() : u,
    send_message: obj(),
  };
};
const _botInlineMessageMediaAuto = (): any => {
  const flags = i32();
  return {
    _: 'botInlineMessageMediaAuto',
    message: str(),
    entities: flags & 0x2 ? vector(obj) : u,
    reply_markup: flags & 0x4 ? obj() : u,
  };
};
const _botInlineMessageText = (): any => {
  const flags = i32();
  return {
    _: 'botInlineMessageText',
    no_webpage: !!(flags & 0x1),
    message: str(),
    entities: flags & 0x2 ? vector(obj) : u,
    reply_markup: flags & 0x4 ? obj() : u,
  };
};
const _botInlineResult = (): any => {
  const flags = i32();
  return {
    _: 'botInlineResult',
    id: str(),
    type: str(),
    title: flags & 0x2 ? str() : u,
    description: flags & 0x4 ? str() : u,
    url: flags & 0x8 ? str() : u,
    thumb: flags & 0x10 ? obj() : u,
    content: flags & 0x20 ? obj() : u,
    send_message: obj(),
  };
};
const _messagesBotResults = (): any => {
  const flags = i32();
  return {
    _: 'messages.botResults',
    gallery: !!(flags & 0x1),
    query_id: i64(),
    next_offset: flags & 0x2 ? str() : u,
    switch_pm: flags & 0x4 ? obj() : u,
    results: vector(obj),
    cache_time: i32(),
    users: vector(obj),
  };
};
const _updateBotInlineQuery = (): any => {
  const flags = i32();
  return {
    _: 'updateBotInlineQuery',
    query_id: i64(),
    user_id: i32(),
    query: str(),
    geo: flags & 0x1 ? obj() : u,
    offset: str(),
  };
};
const _updateBotInlineSend = (): any => {
  const flags = i32();
  return {
    _: 'updateBotInlineSend',
    user_id: i32(),
    query: str(),
    geo: flags & 0x1 ? obj() : u,
    id: str(),
    msg_id: flags & 0x2 ? obj() : u,
  };
};
const _inputMessagesFilterVoice: any = () => ({ _: 'inputMessagesFilterVoice' });
const _inputMessagesFilterMusic: any = () => ({ _: 'inputMessagesFilterMusic' });
const _inputPrivacyKeyChatInvite: any = () => ({ _: 'inputPrivacyKeyChatInvite' });
const _privacyKeyChatInvite: any = () => ({ _: 'privacyKeyChatInvite' });
const _exportedMessageLink: any = () => ({ _: 'exportedMessageLink', link: str(), html: str() });
const _messageFwdHeader = (): any => {
  const flags = i32();
  return {
    _: 'messageFwdHeader',
    from_id: flags & 0x1 ? i32() : u,
    from_name: flags & 0x20 ? str() : u,
    date: i32(),
    channel_id: flags & 0x2 ? i32() : u,
    channel_post: flags & 0x4 ? i32() : u,
    post_author: flags & 0x8 ? str() : u,
    saved_from_peer: flags & 0x10 ? obj() : u,
    saved_from_msg_id: flags & 0x10 ? i32() : u,
  };
};
const _updateEditChannelMessage: any = () => ({ _: 'updateEditChannelMessage', message: obj(), pts: i32(), pts_count: i32() });
const _updateChannelPinnedMessage: any = () => ({ _: 'updateChannelPinnedMessage', channel_id: i32(), id: i32() });
const _messageActionPinMessage: any = () => ({ _: 'messageActionPinMessage' });
const _authCodeTypeSms: any = () => ({ _: 'auth.codeTypeSms' });
const _authCodeTypeCall: any = () => ({ _: 'auth.codeTypeCall' });
const _authCodeTypeFlashCall: any = () => ({ _: 'auth.codeTypeFlashCall' });
const _authSentCodeTypeApp: any = () => ({ _: 'auth.sentCodeTypeApp', length: i32() });
const _authSentCodeTypeSms: any = () => ({ _: 'auth.sentCodeTypeSms', length: i32() });
const _authSentCodeTypeCall: any = () => ({ _: 'auth.sentCodeTypeCall', length: i32() });
const _authSentCodeTypeFlashCall: any = () => ({ _: 'auth.sentCodeTypeFlashCall', pattern: str() });
const _keyboardButtonUrl: any = () => ({ _: 'keyboardButtonUrl', text: str(), url: str() });
const _keyboardButtonCallback: any = () => ({ _: 'keyboardButtonCallback', text: str(), data: bytes() });
const _keyboardButtonRequestPhone: any = () => ({ _: 'keyboardButtonRequestPhone', text: str() });
const _keyboardButtonRequestGeoLocation: any = () => ({ _: 'keyboardButtonRequestGeoLocation', text: str() });
const _keyboardButtonSwitchInline = (): any => {
  const flags = i32();
  return {
    _: 'keyboardButtonSwitchInline',
    same_peer: !!(flags & 0x1),
    text: str(),
    query: str(),
  };
};
const _replyInlineMarkup: any = () => ({ _: 'replyInlineMarkup', rows: vector(obj) });
const _messagesBotCallbackAnswer = (): any => {
  const flags = i32();
  return {
    _: 'messages.botCallbackAnswer',
    alert: !!(flags & 0x2),
    has_url: !!(flags & 0x8),
    native_ui: !!(flags & 0x10),
    message: flags & 0x1 ? str() : u,
    url: flags & 0x4 ? str() : u,
    cache_time: i32(),
  };
};
const _updateBotCallbackQuery = (): any => {
  const flags = i32();
  return {
    _: 'updateBotCallbackQuery',
    query_id: i64(),
    user_id: i32(),
    peer: obj(),
    msg_id: i32(),
    chat_instance: i64(),
    data: flags & 0x1 ? bytes() : u,
    game_short_name: flags & 0x2 ? str() : u,
  };
};
const _messagesMessageEditData = (): any => {
  const flags = i32();
  return {
    _: 'messages.messageEditData',
    caption: !!(flags & 0x1),
  };
};
const _updateEditMessage: any = () => ({ _: 'updateEditMessage', message: obj(), pts: i32(), pts_count: i32() });
const _inputBotInlineMessageMediaGeo = (): any => {
  const flags = i32();
  return {
    _: 'inputBotInlineMessageMediaGeo',
    geo_point: obj(),
    period: i32(),
    reply_markup: flags & 0x4 ? obj() : u,
  };
};
const _inputBotInlineMessageMediaVenue = (): any => {
  const flags = i32();
  return {
    _: 'inputBotInlineMessageMediaVenue',
    geo_point: obj(),
    title: str(),
    address: str(),
    provider: str(),
    venue_id: str(),
    venue_type: str(),
    reply_markup: flags & 0x4 ? obj() : u,
  };
};
const _inputBotInlineMessageMediaContact = (): any => {
  const flags = i32();
  return {
    _: 'inputBotInlineMessageMediaContact',
    phone_number: str(),
    first_name: str(),
    last_name: str(),
    vcard: str(),
    reply_markup: flags & 0x4 ? obj() : u,
  };
};
const _botInlineMessageMediaGeo = (): any => {
  const flags = i32();
  return {
    _: 'botInlineMessageMediaGeo',
    geo: obj(),
    period: i32(),
    reply_markup: flags & 0x4 ? obj() : u,
  };
};
const _botInlineMessageMediaVenue = (): any => {
  const flags = i32();
  return {
    _: 'botInlineMessageMediaVenue',
    geo: obj(),
    title: str(),
    address: str(),
    provider: str(),
    venue_id: str(),
    venue_type: str(),
    reply_markup: flags & 0x4 ? obj() : u,
  };
};
const _botInlineMessageMediaContact = (): any => {
  const flags = i32();
  return {
    _: 'botInlineMessageMediaContact',
    phone_number: str(),
    first_name: str(),
    last_name: str(),
    vcard: str(),
    reply_markup: flags & 0x4 ? obj() : u,
  };
};
const _inputBotInlineResultPhoto: any = () => ({ _: 'inputBotInlineResultPhoto', id: str(), type: str(), photo: obj(), send_message: obj() });
const _inputBotInlineResultDocument = (): any => {
  const flags = i32();
  return {
    _: 'inputBotInlineResultDocument',
    id: str(),
    type: str(),
    title: flags & 0x2 ? str() : u,
    description: flags & 0x4 ? str() : u,
    document: obj(),
    send_message: obj(),
  };
};
const _botInlineMediaResult = (): any => {
  const flags = i32();
  return {
    _: 'botInlineMediaResult',
    id: str(),
    type: str(),
    photo: flags & 0x1 ? obj() : u,
    document: flags & 0x2 ? obj() : u,
    title: flags & 0x4 ? str() : u,
    description: flags & 0x8 ? str() : u,
    send_message: obj(),
  };
};
const _inputBotInlineMessageID: any = () => ({ _: 'inputBotInlineMessageID', dc_id: i32(), id: i64(), access_hash: i64() });
const _updateInlineBotCallbackQuery = (): any => {
  const flags = i32();
  return {
    _: 'updateInlineBotCallbackQuery',
    query_id: i64(),
    user_id: i32(),
    msg_id: obj(),
    chat_instance: i64(),
    data: flags & 0x1 ? bytes() : u,
    game_short_name: flags & 0x2 ? str() : u,
  };
};
const _inlineBotSwitchPM: any = () => ({ _: 'inlineBotSwitchPM', text: str(), start_param: str() });
const _messagesPeerDialogs: any = () => ({ _: 'messages.peerDialogs', dialogs: vector(obj), messages: vector(obj), chats: vector(obj), users: vector(obj), state: obj() });
const _topPeer: any = () => ({ _: 'topPeer', peer: obj(), rating: f64() });
const _topPeerCategoryBotsPM: any = () => ({ _: 'topPeerCategoryBotsPM' });
const _topPeerCategoryBotsInline: any = () => ({ _: 'topPeerCategoryBotsInline' });
const _topPeerCategoryCorrespondents: any = () => ({ _: 'topPeerCategoryCorrespondents' });
const _topPeerCategoryGroups: any = () => ({ _: 'topPeerCategoryGroups' });
const _topPeerCategoryChannels: any = () => ({ _: 'topPeerCategoryChannels' });
const _topPeerCategoryPeers: any = () => ({ _: 'topPeerCategoryPeers', category: obj(), count: i32(), peers: vector(obj) });
const _contactsTopPeersNotModified: any = () => ({ _: 'contacts.topPeersNotModified' });
const _contactsTopPeers: any = () => ({ _: 'contacts.topPeers', categories: vector(obj), chats: vector(obj), users: vector(obj) });
const _messageEntityMentionName: any = () => ({ _: 'messageEntityMentionName', offset: i32(), length: i32(), user_id: i32() });
const _inputMessageEntityMentionName: any = () => ({ _: 'inputMessageEntityMentionName', offset: i32(), length: i32(), user_id: obj() });
const _inputMessagesFilterChatPhotos: any = () => ({ _: 'inputMessagesFilterChatPhotos' });
const _updateReadChannelOutbox: any = () => ({ _: 'updateReadChannelOutbox', channel_id: i32(), max_id: i32() });
const _updateDraftMessage: any = () => ({ _: 'updateDraftMessage', peer: obj(), draft: obj() });
const _draftMessageEmpty = (): any => {
  const flags = i32();
  return {
    _: 'draftMessageEmpty',
    date: flags & 0x1 ? i32() : u,
  };
};
const _draftMessage = (): any => {
  const flags = i32();
  return {
    _: 'draftMessage',
    no_webpage: !!(flags & 0x2),
    reply_to_msg_id: flags & 0x1 ? i32() : u,
    message: str(),
    entities: flags & 0x8 ? vector(obj) : u,
    date: i32(),
  };
};
const _messageActionHistoryClear: any = () => ({ _: 'messageActionHistoryClear' });
const _messagesFeaturedStickersNotModified: any = () => ({ _: 'messages.featuredStickersNotModified' });
const _messagesFeaturedStickers: any = () => ({ _: 'messages.featuredStickers', hash: i32(), sets: vector(obj), unread: vector(i64) });
const _updateReadFeaturedStickers: any = () => ({ _: 'updateReadFeaturedStickers' });
const _messagesRecentStickersNotModified: any = () => ({ _: 'messages.recentStickersNotModified' });
const _messagesRecentStickers: any = () => ({ _: 'messages.recentStickers', hash: i32(), packs: vector(obj), stickers: vector(obj), dates: vector(i32) });
const _updateRecentStickers: any = () => ({ _: 'updateRecentStickers' });
const _messagesArchivedStickers: any = () => ({ _: 'messages.archivedStickers', count: i32(), sets: vector(obj) });
const _messagesStickerSetInstallResultSuccess: any = () => ({ _: 'messages.stickerSetInstallResultSuccess' });
const _messagesStickerSetInstallResultArchive: any = () => ({ _: 'messages.stickerSetInstallResultArchive', sets: vector(obj) });
const _stickerSetCovered: any = () => ({ _: 'stickerSetCovered', set: obj(), cover: obj() });
const _updateConfig: any = () => ({ _: 'updateConfig' });
const _updatePtsChanged: any = () => ({ _: 'updatePtsChanged' });
const _inputMediaPhotoExternal = (): any => {
  const flags = i32();
  return {
    _: 'inputMediaPhotoExternal',
    url: str(),
    ttl_seconds: flags & 0x1 ? i32() : u,
  };
};
const _inputMediaDocumentExternal = (): any => {
  const flags = i32();
  return {
    _: 'inputMediaDocumentExternal',
    url: str(),
    ttl_seconds: flags & 0x1 ? i32() : u,
  };
};
const _stickerSetMultiCovered: any = () => ({ _: 'stickerSetMultiCovered', set: obj(), covers: vector(obj) });
const _maskCoords: any = () => ({ _: 'maskCoords', n: i32(), x: f64(), y: f64(), zoom: f64() });
const _documentAttributeHasStickers: any = () => ({ _: 'documentAttributeHasStickers' });
const _inputStickeredMediaPhoto: any = () => ({ _: 'inputStickeredMediaPhoto', id: obj() });
const _inputStickeredMediaDocument: any = () => ({ _: 'inputStickeredMediaDocument', id: obj() });
const _game = (): any => {
  const flags = i32();
  return {
    _: 'game',
    id: i64(),
    access_hash: i64(),
    short_name: str(),
    title: str(),
    description: str(),
    photo: obj(),
    document: flags & 0x1 ? obj() : u,
  };
};
const _inputBotInlineResultGame: any = () => ({ _: 'inputBotInlineResultGame', id: str(), short_name: str(), send_message: obj() });
const _inputBotInlineMessageGame = (): any => {
  const flags = i32();
  return {
    _: 'inputBotInlineMessageGame',
    reply_markup: flags & 0x4 ? obj() : u,
  };
};
const _messageMediaGame: any = () => ({ _: 'messageMediaGame', game: obj() });
const _inputMediaGame: any = () => ({ _: 'inputMediaGame', id: obj() });
const _inputGameID: any = () => ({ _: 'inputGameID', id: i64(), access_hash: i64() });
const _inputGameShortName: any = () => ({ _: 'inputGameShortName', bot_id: obj(), short_name: str() });
const _keyboardButtonGame: any = () => ({ _: 'keyboardButtonGame', text: str() });
const _messageActionGameScore: any = () => ({ _: 'messageActionGameScore', game_id: i64(), score: i32() });
const _highScore: any = () => ({ _: 'highScore', pos: i32(), user_id: i32(), score: i32() });
const _messagesHighScores: any = () => ({ _: 'messages.highScores', scores: vector(obj), users: vector(obj) });
const _updatesDifferenceTooLong: any = () => ({ _: 'updates.differenceTooLong', pts: i32() });
const _updateChannelWebPage: any = () => ({ _: 'updateChannelWebPage', channel_id: i32(), webpage: obj(), pts: i32(), pts_count: i32() });
const _messagesChatsSlice: any = () => ({ _: 'messages.chatsSlice', count: i32(), chats: vector(obj) });
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
  const flags = i32();
  return {
    _: 'pageBlockPhoto',
    photo_id: i64(),
    caption: obj(),
    url: flags & 0x1 ? str() : u,
    webpage_id: flags & 0x1 ? i64() : u,
  };
};
const _pageBlockVideo = (): any => {
  const flags = i32();
  return {
    _: 'pageBlockVideo',
    autoplay: !!(flags & 0x1),
    loop: !!(flags & 0x2),
    video_id: i64(),
    caption: obj(),
  };
};
const _pageBlockCover: any = () => ({ _: 'pageBlockCover', cover: obj() });
const _pageBlockEmbed = (): any => {
  const flags = i32();
  return {
    _: 'pageBlockEmbed',
    full_width: !!(flags & 0x1),
    allow_scrolling: !!(flags & 0x8),
    url: flags & 0x2 ? str() : u,
    html: flags & 0x4 ? str() : u,
    poster_photo_id: flags & 0x10 ? i64() : u,
    w: flags & 0x20 ? i32() : u,
    h: flags & 0x20 ? i32() : u,
    caption: obj(),
  };
};
const _pageBlockEmbedPost: any = () => ({ _: 'pageBlockEmbedPost', url: str(), webpage_id: i64(), author_photo_id: i64(), author: str(), date: i32(), blocks: vector(obj), caption: obj() });
const _pageBlockCollage: any = () => ({ _: 'pageBlockCollage', items: vector(obj), caption: obj() });
const _pageBlockSlideshow: any = () => ({ _: 'pageBlockSlideshow', items: vector(obj), caption: obj() });
const _webPageNotModified: any = () => ({ _: 'webPageNotModified' });
const _inputPrivacyKeyPhoneCall: any = () => ({ _: 'inputPrivacyKeyPhoneCall' });
const _privacyKeyPhoneCall: any = () => ({ _: 'privacyKeyPhoneCall' });
const _sendMessageGamePlayAction: any = () => ({ _: 'sendMessageGamePlayAction' });
const _phoneCallDiscardReasonMissed: any = () => ({ _: 'phoneCallDiscardReasonMissed' });
const _phoneCallDiscardReasonDisconnect: any = () => ({ _: 'phoneCallDiscardReasonDisconnect' });
const _phoneCallDiscardReasonHangup: any = () => ({ _: 'phoneCallDiscardReasonHangup' });
const _phoneCallDiscardReasonBusy: any = () => ({ _: 'phoneCallDiscardReasonBusy' });
const _updateDialogPinned = (): any => {
  const flags = i32();
  return {
    _: 'updateDialogPinned',
    pinned: !!(flags & 0x1),
    folder_id: flags & 0x2 ? i32() : u,
    peer: obj(),
  };
};
const _updatePinnedDialogs = (): any => {
  const flags = i32();
  return {
    _: 'updatePinnedDialogs',
    folder_id: flags & 0x2 ? i32() : u,
    order: flags & 0x1 ? vector(obj) : u,
  };
};
const _dataJSON: any = () => ({ _: 'dataJSON', data: str() });
const _updateBotWebhookJSON: any = () => ({ _: 'updateBotWebhookJSON', data: obj() });
const _updateBotWebhookJSONQuery: any = () => ({ _: 'updateBotWebhookJSONQuery', query_id: i64(), data: obj(), timeout: i32() });
const _labeledPrice: any = () => ({ _: 'labeledPrice', label: str(), amount: i64() });
const _invoice = (): any => {
  const flags = i32();
  return {
    _: 'invoice',
    test: !!(flags & 0x1),
    name_requested: !!(flags & 0x2),
    phone_requested: !!(flags & 0x4),
    email_requested: !!(flags & 0x8),
    shipping_address_requested: !!(flags & 0x10),
    flexible: !!(flags & 0x20),
    phone_to_provider: !!(flags & 0x40),
    email_to_provider: !!(flags & 0x80),
    currency: str(),
    prices: vector(obj),
  };
};
const _inputMediaInvoice = (): any => {
  const flags = i32();
  return {
    _: 'inputMediaInvoice',
    title: str(),
    description: str(),
    photo: flags & 0x1 ? obj() : u,
    invoice: obj(),
    payload: bytes(),
    provider: str(),
    provider_data: obj(),
    start_param: str(),
  };
};
const _paymentCharge: any = () => ({ _: 'paymentCharge', id: str(), provider_charge_id: str() });
const _messageActionPaymentSentMe = (): any => {
  const flags = i32();
  return {
    _: 'messageActionPaymentSentMe',
    currency: str(),
    total_amount: i64(),
    payload: bytes(),
    info: flags & 0x1 ? obj() : u,
    shipping_option_id: flags & 0x2 ? str() : u,
    charge: obj(),
  };
};
const _messageMediaInvoice = (): any => {
  const flags = i32();
  return {
    _: 'messageMediaInvoice',
    shipping_address_requested: !!(flags & 0x2),
    test: !!(flags & 0x8),
    title: str(),
    description: str(),
    photo: flags & 0x1 ? obj() : u,
    receipt_msg_id: flags & 0x4 ? i32() : u,
    currency: str(),
    total_amount: i64(),
    start_param: str(),
  };
};
const _postAddress: any = () => ({ _: 'postAddress', street_line1: str(), street_line2: str(), city: str(), state: str(), country_iso2: str(), post_code: str() });
const _paymentRequestedInfo = (): any => {
  const flags = i32();
  return {
    _: 'paymentRequestedInfo',
    name: flags & 0x1 ? str() : u,
    phone: flags & 0x2 ? str() : u,
    email: flags & 0x4 ? str() : u,
    shipping_address: flags & 0x8 ? obj() : u,
  };
};
const _keyboardButtonBuy: any = () => ({ _: 'keyboardButtonBuy', text: str() });
const _messageActionPaymentSent: any = () => ({ _: 'messageActionPaymentSent', currency: str(), total_amount: i64() });
const _paymentSavedCredentialsCard: any = () => ({ _: 'paymentSavedCredentialsCard', id: str(), title: str() });
const _webDocument: any = () => ({ _: 'webDocument', url: str(), access_hash: i64(), size: i32(), mime_type: str(), attributes: vector(obj) });
const _inputWebDocument: any = () => ({ _: 'inputWebDocument', url: str(), size: i32(), mime_type: str(), attributes: vector(obj) });
const _inputWebFileLocation: any = () => ({ _: 'inputWebFileLocation', url: str(), access_hash: i64() });
const _uploadWebFile: any = () => ({ _: 'upload.webFile', size: i32(), mime_type: str(), file_type: obj(), mtime: i32(), bytes: bytes() });
const _paymentsPaymentForm = (): any => {
  const flags = i32();
  return {
    _: 'payments.paymentForm',
    can_save_credentials: !!(flags & 0x4),
    password_missing: !!(flags & 0x8),
    bot_id: i32(),
    invoice: obj(),
    provider_id: i32(),
    url: str(),
    native_provider: flags & 0x10 ? str() : u,
    native_params: flags & 0x10 ? obj() : u,
    saved_info: flags & 0x1 ? obj() : u,
    saved_credentials: flags & 0x2 ? obj() : u,
    users: vector(obj),
  };
};
const _paymentsValidatedRequestedInfo = (): any => {
  const flags = i32();
  return {
    _: 'payments.validatedRequestedInfo',
    id: flags & 0x1 ? str() : u,
    shipping_options: flags & 0x2 ? vector(obj) : u,
  };
};
const _paymentsPaymentResult: any = () => ({ _: 'payments.paymentResult', updates: obj() });
const _paymentsPaymentReceipt = (): any => {
  const flags = i32();
  return {
    _: 'payments.paymentReceipt',
    date: i32(),
    bot_id: i32(),
    invoice: obj(),
    provider_id: i32(),
    info: flags & 0x1 ? obj() : u,
    shipping: flags & 0x2 ? obj() : u,
    currency: str(),
    total_amount: i64(),
    credentials_title: str(),
    users: vector(obj),
  };
};
const _paymentsSavedInfo = (): any => {
  const flags = i32();
  return {
    _: 'payments.savedInfo',
    has_saved_credentials: !!(flags & 0x2),
    saved_info: flags & 0x1 ? obj() : u,
  };
};
const _inputPaymentCredentialsSaved: any = () => ({ _: 'inputPaymentCredentialsSaved', id: str(), tmp_password: bytes() });
const _inputPaymentCredentials = (): any => {
  const flags = i32();
  return {
    _: 'inputPaymentCredentials',
    save: !!(flags & 0x1),
    data: obj(),
  };
};
const _accountTmpPassword: any = () => ({ _: 'account.tmpPassword', tmp_password: bytes(), valid_until: i32() });
const _shippingOption: any = () => ({ _: 'shippingOption', id: str(), title: str(), prices: vector(obj) });
const _updateBotShippingQuery: any = () => ({ _: 'updateBotShippingQuery', query_id: i64(), user_id: i32(), payload: bytes(), shipping_address: obj() });
const _updateBotPrecheckoutQuery = (): any => {
  const flags = i32();
  return {
    _: 'updateBotPrecheckoutQuery',
    query_id: i64(),
    user_id: i32(),
    payload: bytes(),
    info: flags & 0x1 ? obj() : u,
    shipping_option_id: flags & 0x2 ? str() : u,
    currency: str(),
    total_amount: i64(),
  };
};
const _inputStickerSetItem = (): any => {
  const flags = i32();
  return {
    _: 'inputStickerSetItem',
    document: obj(),
    emoji: str(),
    mask_coords: flags & 0x1 ? obj() : u,
  };
};
const _updatePhoneCall: any = () => ({ _: 'updatePhoneCall', phone_call: obj() });
const _inputPhoneCall: any = () => ({ _: 'inputPhoneCall', id: i64(), access_hash: i64() });
const _phoneCallEmpty: any = () => ({ _: 'phoneCallEmpty', id: i64() });
const _phoneCallWaiting = (): any => {
  const flags = i32();
  return {
    _: 'phoneCallWaiting',
    video: !!(flags & 0x20),
    id: i64(),
    access_hash: i64(),
    date: i32(),
    admin_id: i32(),
    participant_id: i32(),
    protocol: obj(),
    receive_date: flags & 0x1 ? i32() : u,
  };
};
const _phoneCallRequested = (): any => {
  const flags = i32();
  return {
    _: 'phoneCallRequested',
    video: !!(flags & 0x20),
    id: i64(),
    access_hash: i64(),
    date: i32(),
    admin_id: i32(),
    participant_id: i32(),
    g_a_hash: bytes(),
    protocol: obj(),
  };
};
const _phoneCallAccepted = (): any => {
  const flags = i32();
  return {
    _: 'phoneCallAccepted',
    video: !!(flags & 0x20),
    id: i64(),
    access_hash: i64(),
    date: i32(),
    admin_id: i32(),
    participant_id: i32(),
    g_b: bytes(),
    protocol: obj(),
  };
};
const _phoneCall = (): any => {
  const flags = i32();
  return {
    _: 'phoneCall',
    p2p_allowed: !!(flags & 0x20),
    id: i64(),
    access_hash: i64(),
    date: i32(),
    admin_id: i32(),
    participant_id: i32(),
    g_a_or_b: bytes(),
    key_fingerprint: i64(),
    protocol: obj(),
    connections: vector(obj),
    start_date: i32(),
  };
};
const _phoneCallDiscarded = (): any => {
  const flags = i32();
  return {
    _: 'phoneCallDiscarded',
    need_rating: !!(flags & 0x4),
    need_debug: !!(flags & 0x8),
    video: !!(flags & 0x20),
    id: i64(),
    reason: flags & 0x1 ? obj() : u,
    duration: flags & 0x2 ? i32() : u,
  };
};
const _phoneConnection: any = () => ({ _: 'phoneConnection', id: i64(), ip: str(), ipv6: str(), port: i32(), peer_tag: bytes() });
const _phoneCallProtocol = (): any => {
  const flags = i32();
  return {
    _: 'phoneCallProtocol',
    udp_p2p: !!(flags & 0x1),
    udp_reflector: !!(flags & 0x2),
    min_layer: i32(),
    max_layer: i32(),
  };
};
const _phonePhoneCall: any = () => ({ _: 'phone.phoneCall', phone_call: obj(), users: vector(obj) });
const _inputMessagesFilterPhoneCalls = (): any => {
  const flags = i32();
  return {
    _: 'inputMessagesFilterPhoneCalls',
    missed: !!(flags & 0x1),
  };
};
const _messageActionPhoneCall = (): any => {
  const flags = i32();
  return {
    _: 'messageActionPhoneCall',
    video: !!(flags & 0x4),
    call_id: i64(),
    reason: flags & 0x1 ? obj() : u,
    duration: flags & 0x2 ? i32() : u,
  };
};
const _inputMessagesFilterRoundVoice: any = () => ({ _: 'inputMessagesFilterRoundVoice' });
const _inputMessagesFilterRoundVideo: any = () => ({ _: 'inputMessagesFilterRoundVideo' });
const _sendMessageRecordRoundAction: any = () => ({ _: 'sendMessageRecordRoundAction' });
const _sendMessageUploadRoundAction: any = () => ({ _: 'sendMessageUploadRoundAction', progress: i32() });
const _uploadFileCdnRedirect: any = () => ({ _: 'upload.fileCdnRedirect', dc_id: i32(), file_token: bytes(), encryption_key: bytes(), encryption_iv: bytes(), file_hashes: vector(obj) });
const _uploadCdnFileReuploadNeeded: any = () => ({ _: 'upload.cdnFileReuploadNeeded', request_token: bytes() });
const _uploadCdnFile: any = () => ({ _: 'upload.cdnFile', bytes: bytes() });
const _cdnPublicKey: any = () => ({ _: 'cdnPublicKey', dc_id: i32(), public_key: str() });
const _cdnConfig: any = () => ({ _: 'cdnConfig', public_keys: vector(obj) });
const _pageBlockChannel: any = () => ({ _: 'pageBlockChannel', channel: obj() });
const _langPackString: any = () => ({ _: 'langPackString', key: str(), value: str() });
const _langPackStringPluralized = (): any => {
  const flags = i32();
  return {
    _: 'langPackStringPluralized',
    key: str(),
    zero_value: flags & 0x1 ? str() : u,
    one_value: flags & 0x2 ? str() : u,
    two_value: flags & 0x4 ? str() : u,
    few_value: flags & 0x8 ? str() : u,
    many_value: flags & 0x10 ? str() : u,
    other_value: str(),
  };
};
const _langPackStringDeleted: any = () => ({ _: 'langPackStringDeleted', key: str() });
const _langPackDifference: any = () => ({ _: 'langPackDifference', lang_code: str(), from_version: i32(), version: i32(), strings: vector(obj) });
const _langPackLanguage = (): any => {
  const flags = i32();
  return {
    _: 'langPackLanguage',
    official: !!(flags & 0x1),
    rtl: !!(flags & 0x4),
    beta: !!(flags & 0x8),
    name: str(),
    native_name: str(),
    lang_code: str(),
    base_lang_code: flags & 0x2 ? str() : u,
    plural_code: str(),
    strings_count: i32(),
    translated_count: i32(),
    translations_url: str(),
  };
};
const _updateLangPackTooLong: any = () => ({ _: 'updateLangPackTooLong', lang_code: str() });
const _updateLangPack: any = () => ({ _: 'updateLangPack', difference: obj() });
const _channelParticipantAdmin = (): any => {
  const flags = i32();
  return {
    _: 'channelParticipantAdmin',
    can_edit: !!(flags & 0x1),
    self: !!(flags & 0x2),
    user_id: i32(),
    inviter_id: flags & 0x2 ? i32() : u,
    promoted_by: i32(),
    date: i32(),
    admin_rights: obj(),
    rank: flags & 0x4 ? str() : u,
  };
};
const _channelParticipantBanned = (): any => {
  const flags = i32();
  return {
    _: 'channelParticipantBanned',
    left: !!(flags & 0x1),
    user_id: i32(),
    kicked_by: i32(),
    date: i32(),
    banned_rights: obj(),
  };
};
const _channelParticipantsBanned: any = () => ({ _: 'channelParticipantsBanned', q: str() });
const _channelParticipantsSearch: any = () => ({ _: 'channelParticipantsSearch', q: str() });
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
const _channelAdminLogEvent: any = () => ({ _: 'channelAdminLogEvent', id: i64(), date: i32(), user_id: i32(), action: obj() });
const _channelsAdminLogResults: any = () => ({ _: 'channels.adminLogResults', events: vector(obj), chats: vector(obj), users: vector(obj) });
const _channelAdminLogEventsFilter = (): any => {
  const flags = i32();
  return {
    _: 'channelAdminLogEventsFilter',
    join: !!(flags & 0x1),
    leave: !!(flags & 0x2),
    invite: !!(flags & 0x4),
    ban: !!(flags & 0x8),
    unban: !!(flags & 0x10),
    kick: !!(flags & 0x20),
    unkick: !!(flags & 0x40),
    promote: !!(flags & 0x80),
    demote: !!(flags & 0x100),
    info: !!(flags & 0x200),
    settings: !!(flags & 0x400),
    pinned: !!(flags & 0x800),
    edit: !!(flags & 0x1000),
    delete: !!(flags & 0x2000),
  };
};
const _topPeerCategoryPhoneCalls: any = () => ({ _: 'topPeerCategoryPhoneCalls' });
const _pageBlockAudio: any = () => ({ _: 'pageBlockAudio', audio_id: i64(), caption: obj() });
const _popularContact: any = () => ({ _: 'popularContact', client_id: i64(), importers: i32() });
const _messageActionScreenshotTaken: any = () => ({ _: 'messageActionScreenshotTaken' });
const _messagesFavedStickersNotModified: any = () => ({ _: 'messages.favedStickersNotModified' });
const _messagesFavedStickers: any = () => ({ _: 'messages.favedStickers', hash: i32(), packs: vector(obj), stickers: vector(obj) });
const _updateFavedStickers: any = () => ({ _: 'updateFavedStickers' });
const _updateChannelReadMessagesContents: any = () => ({ _: 'updateChannelReadMessagesContents', channel_id: i32(), messages: vector(i32) });
const _inputMessagesFilterMyMentions: any = () => ({ _: 'inputMessagesFilterMyMentions' });
const _updateContactsReset: any = () => ({ _: 'updateContactsReset' });
const _channelAdminLogEventActionChangeStickerSet: any = () => ({ _: 'channelAdminLogEventActionChangeStickerSet', prev_stickerset: obj(), new_stickerset: obj() });
const _messageActionCustomAction: any = () => ({ _: 'messageActionCustomAction', message: str() });
const _inputPaymentCredentialsApplePay: any = () => ({ _: 'inputPaymentCredentialsApplePay', payment_data: obj() });
const _inputPaymentCredentialsAndroidPay: any = () => ({ _: 'inputPaymentCredentialsAndroidPay', payment_token: obj(), google_transaction_id: str() });
const _inputMessagesFilterGeo: any = () => ({ _: 'inputMessagesFilterGeo' });
const _inputMessagesFilterContacts: any = () => ({ _: 'inputMessagesFilterContacts' });
const _updateChannelAvailableMessages: any = () => ({ _: 'updateChannelAvailableMessages', channel_id: i32(), available_min_id: i32() });
const _channelAdminLogEventActionTogglePreHistoryHidden: any = () => ({ _: 'channelAdminLogEventActionTogglePreHistoryHidden', new_value: obj() });
const _inputMediaGeoLive = (): any => {
  const flags = i32();
  return {
    _: 'inputMediaGeoLive',
    stopped: !!(flags & 0x1),
    geo_point: obj(),
    period: flags & 0x2 ? i32() : u,
  };
};
const _messageMediaGeoLive: any = () => ({ _: 'messageMediaGeoLive', geo: obj(), period: i32() });
const _recentMeUrlUnknown: any = () => ({ _: 'recentMeUrlUnknown', url: str() });
const _recentMeUrlUser: any = () => ({ _: 'recentMeUrlUser', url: str(), user_id: i32() });
const _recentMeUrlChat: any = () => ({ _: 'recentMeUrlChat', url: str(), chat_id: i32() });
const _recentMeUrlChatInvite: any = () => ({ _: 'recentMeUrlChatInvite', url: str(), chat_invite: obj() });
const _recentMeUrlStickerSet: any = () => ({ _: 'recentMeUrlStickerSet', url: str(), set: obj() });
const _helpRecentMeUrls: any = () => ({ _: 'help.recentMeUrls', urls: vector(obj), chats: vector(obj), users: vector(obj) });
const _channelsChannelParticipantsNotModified: any = () => ({ _: 'channels.channelParticipantsNotModified' });
const _messagesMessagesNotModified: any = () => ({ _: 'messages.messagesNotModified', count: i32() });
const _inputSingleMedia = (): any => {
  const flags = i32();
  return {
    _: 'inputSingleMedia',
    media: obj(),
    random_id: i64(),
    message: str(),
    entities: flags & 0x1 ? vector(obj) : u,
  };
};
const _webAuthorization: any = () => ({ _: 'webAuthorization', hash: i64(), bot_id: i32(), domain: str(), browser: str(), platform: str(), date_created: i32(), date_active: i32(), ip: str(), region: str() });
const _accountWebAuthorizations: any = () => ({ _: 'account.webAuthorizations', authorizations: vector(obj), users: vector(obj) });
const _inputMessageID: any = () => ({ _: 'inputMessageID', id: i32() });
const _inputMessageReplyTo: any = () => ({ _: 'inputMessageReplyTo', id: i32() });
const _inputMessagePinned: any = () => ({ _: 'inputMessagePinned' });
const _messageEntityPhone: any = () => ({ _: 'messageEntityPhone', offset: i32(), length: i32() });
const _messageEntityCashtag: any = () => ({ _: 'messageEntityCashtag', offset: i32(), length: i32() });
const _messageActionBotAllowed: any = () => ({ _: 'messageActionBotAllowed', domain: str() });
const _inputDialogPeer: any = () => ({ _: 'inputDialogPeer', peer: obj() });
const _dialogPeer: any = () => ({ _: 'dialogPeer', peer: obj() });
const _messagesFoundStickerSetsNotModified: any = () => ({ _: 'messages.foundStickerSetsNotModified' });
const _messagesFoundStickerSets: any = () => ({ _: 'messages.foundStickerSets', hash: i32(), sets: vector(obj) });
const _fileHash: any = () => ({ _: 'fileHash', offset: i32(), limit: i32(), hash: bytes() });
const _webDocumentNoProxy: any = () => ({ _: 'webDocumentNoProxy', url: str(), size: i32(), mime_type: str(), attributes: vector(obj) });
const _inputClientProxy: any = () => ({ _: 'inputClientProxy', address: str(), port: i32() });
const _helpProxyDataEmpty: any = () => ({ _: 'help.proxyDataEmpty', expires: i32() });
const _helpProxyDataPromo: any = () => ({ _: 'help.proxyDataPromo', expires: i32(), peer: obj(), chats: vector(obj), users: vector(obj) });
const _helpTermsOfServiceUpdateEmpty: any = () => ({ _: 'help.termsOfServiceUpdateEmpty', expires: i32() });
const _helpTermsOfServiceUpdate: any = () => ({ _: 'help.termsOfServiceUpdate', expires: i32(), terms_of_service: obj() });
const _inputSecureFileUploaded: any = () => ({ _: 'inputSecureFileUploaded', id: i64(), parts: i32(), md5_checksum: str(), file_hash: bytes(), secret: bytes() });
const _inputSecureFile: any = () => ({ _: 'inputSecureFile', id: i64(), access_hash: i64() });
const _inputSecureFileLocation: any = () => ({ _: 'inputSecureFileLocation', id: i64(), access_hash: i64() });
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
  const flags = i32();
  return {
    _: 'secureValue',
    type: obj(),
    data: flags & 0x1 ? obj() : u,
    front_side: flags & 0x2 ? obj() : u,
    reverse_side: flags & 0x4 ? obj() : u,
    selfie: flags & 0x8 ? obj() : u,
    translation: flags & 0x40 ? vector(obj) : u,
    files: flags & 0x10 ? vector(obj) : u,
    plain_data: flags & 0x20 ? obj() : u,
    hash: bytes(),
  };
};
const _inputSecureValue = (): any => {
  const flags = i32();
  return {
    _: 'inputSecureValue',
    type: obj(),
    data: flags & 0x1 ? obj() : u,
    front_side: flags & 0x2 ? obj() : u,
    reverse_side: flags & 0x4 ? obj() : u,
    selfie: flags & 0x8 ? obj() : u,
    translation: flags & 0x40 ? vector(obj) : u,
    files: flags & 0x10 ? vector(obj) : u,
    plain_data: flags & 0x20 ? obj() : u,
  };
};
const _secureValueHash: any = () => ({ _: 'secureValueHash', type: obj(), hash: bytes() });
const _secureValueErrorData: any = () => ({ _: 'secureValueErrorData', type: obj(), data_hash: bytes(), field: str(), text: str() });
const _secureValueErrorFrontSide: any = () => ({ _: 'secureValueErrorFrontSide', type: obj(), file_hash: bytes(), text: str() });
const _secureValueErrorReverseSide: any = () => ({ _: 'secureValueErrorReverseSide', type: obj(), file_hash: bytes(), text: str() });
const _secureValueErrorSelfie: any = () => ({ _: 'secureValueErrorSelfie', type: obj(), file_hash: bytes(), text: str() });
const _secureValueErrorFile: any = () => ({ _: 'secureValueErrorFile', type: obj(), file_hash: bytes(), text: str() });
const _secureValueErrorFiles: any = () => ({ _: 'secureValueErrorFiles', type: obj(), file_hash: vector(bytes), text: str() });
const _secureCredentialsEncrypted: any = () => ({ _: 'secureCredentialsEncrypted', data: bytes(), hash: bytes(), secret: bytes() });
const _accountAuthorizationForm = (): any => {
  const flags = i32();
  return {
    _: 'account.authorizationForm',
    required_types: vector(obj),
    values: vector(obj),
    errors: vector(obj),
    users: vector(obj),
    privacy_policy_url: flags & 0x1 ? str() : u,
  };
};
const _accountSentEmailCode: any = () => ({ _: 'account.sentEmailCode', email_pattern: str(), length: i32() });
const _messageActionSecureValuesSentMe: any = () => ({ _: 'messageActionSecureValuesSentMe', values: vector(obj), credentials: obj() });
const _messageActionSecureValuesSent: any = () => ({ _: 'messageActionSecureValuesSent', types: vector(obj) });
const _helpDeepLinkInfoEmpty: any = () => ({ _: 'help.deepLinkInfoEmpty' });
const _helpDeepLinkInfo = (): any => {
  const flags = i32();
  return {
    _: 'help.deepLinkInfo',
    update_app: !!(flags & 0x1),
    message: str(),
    entities: flags & 0x2 ? vector(obj) : u,
  };
};
const _savedPhoneContact: any = () => ({ _: 'savedPhoneContact', phone: str(), first_name: str(), last_name: str(), date: i32() });
const _accountTakeout: any = () => ({ _: 'account.takeout', id: i64() });
const _inputTakeoutFileLocation: any = () => ({ _: 'inputTakeoutFileLocation' });
const _updateDialogUnreadMark = (): any => {
  const flags = i32();
  return {
    _: 'updateDialogUnreadMark',
    unread: !!(flags & 0x1),
    peer: obj(),
  };
};
const _messagesDialogsNotModified: any = () => ({ _: 'messages.dialogsNotModified', count: i32() });
const _inputWebFileGeoPointLocation: any = () => ({ _: 'inputWebFileGeoPointLocation', geo_point: obj(), access_hash: i64(), w: i32(), h: i32(), zoom: i32(), scale: i32() });
const _contactsTopPeersDisabled: any = () => ({ _: 'contacts.topPeersDisabled' });
const _inputReportReasonCopyright: any = () => ({ _: 'inputReportReasonCopyright' });
const _passwordKdfAlgoUnknown: any = () => ({ _: 'passwordKdfAlgoUnknown' });
const _securePasswordKdfAlgoUnknown: any = () => ({ _: 'securePasswordKdfAlgoUnknown' });
const _securePasswordKdfAlgoPBKDF2HMACSHA512iter100000: any = () => ({ _: 'securePasswordKdfAlgoPBKDF2HMACSHA512iter100000', salt: bytes() });
const _securePasswordKdfAlgoSHA512: any = () => ({ _: 'securePasswordKdfAlgoSHA512', salt: bytes() });
const _secureSecretSettings: any = () => ({ _: 'secureSecretSettings', secure_algo: obj(), secure_secret: bytes(), secure_secret_id: i64() });
const _passwordKdfAlgoSHA256SHA256PBKDF2HMACSHA512iter100000SHA256ModPow: any = () => ({ _: 'passwordKdfAlgoSHA256SHA256PBKDF2HMACSHA512iter100000SHA256ModPow', salt1: bytes(), salt2: bytes(), g: i32(), p: bytes() });
const _inputCheckPasswordEmpty: any = () => ({ _: 'inputCheckPasswordEmpty' });
const _inputCheckPasswordSRP: any = () => ({ _: 'inputCheckPasswordSRP', srp_id: i64(), A: bytes(), M1: bytes() });
const _secureValueError: any = () => ({ _: 'secureValueError', type: obj(), hash: bytes(), text: str() });
const _secureValueErrorTranslationFile: any = () => ({ _: 'secureValueErrorTranslationFile', type: obj(), file_hash: bytes(), text: str() });
const _secureValueErrorTranslationFiles: any = () => ({ _: 'secureValueErrorTranslationFiles', type: obj(), file_hash: vector(bytes), text: str() });
const _secureRequiredType = (): any => {
  const flags = i32();
  return {
    _: 'secureRequiredType',
    native_names: !!(flags & 0x1),
    selfie_required: !!(flags & 0x2),
    translation_required: !!(flags & 0x4),
    type: obj(),
  };
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
const _updateUserPinnedMessage: any = () => ({ _: 'updateUserPinnedMessage', user_id: i32(), id: i32() });
const _updateChatPinnedMessage: any = () => ({ _: 'updateChatPinnedMessage', chat_id: i32(), id: i32(), version: i32() });
const _inputNotifyBroadcasts: any = () => ({ _: 'inputNotifyBroadcasts' });
const _notifyBroadcasts: any = () => ({ _: 'notifyBroadcasts' });
const _textSubscript: any = () => ({ _: 'textSubscript', text: obj() });
const _textSuperscript: any = () => ({ _: 'textSuperscript', text: obj() });
const _textMarked: any = () => ({ _: 'textMarked', text: obj() });
const _textPhone: any = () => ({ _: 'textPhone', text: obj(), phone: str() });
const _textImage: any = () => ({ _: 'textImage', document_id: i64(), w: i32(), h: i32() });
const _pageBlockKicker: any = () => ({ _: 'pageBlockKicker', text: obj() });
const _pageTableCell = (): any => {
  const flags = i32();
  return {
    _: 'pageTableCell',
    header: !!(flags & 0x1),
    align_center: !!(flags & 0x8),
    align_right: !!(flags & 0x10),
    valign_middle: !!(flags & 0x20),
    valign_bottom: !!(flags & 0x40),
    text: flags & 0x80 ? obj() : u,
    colspan: flags & 0x2 ? i32() : u,
    rowspan: flags & 0x4 ? i32() : u,
  };
};
const _pageTableRow: any = () => ({ _: 'pageTableRow', cells: vector(obj) });
const _pageBlockTable = (): any => {
  const flags = i32();
  return {
    _: 'pageBlockTable',
    bordered: !!(flags & 0x1),
    striped: !!(flags & 0x2),
    title: obj(),
    rows: vector(obj),
  };
};
const _pageCaption: any = () => ({ _: 'pageCaption', text: obj(), credit: obj() });
const _pageListItemText: any = () => ({ _: 'pageListItemText', text: obj() });
const _pageListItemBlocks: any = () => ({ _: 'pageListItemBlocks', blocks: vector(obj) });
const _pageListOrderedItemText: any = () => ({ _: 'pageListOrderedItemText', num: str(), text: obj() });
const _pageListOrderedItemBlocks: any = () => ({ _: 'pageListOrderedItemBlocks', num: str(), blocks: vector(obj) });
const _pageBlockOrderedList: any = () => ({ _: 'pageBlockOrderedList', items: vector(obj) });
const _pageBlockDetails = (): any => {
  const flags = i32();
  return {
    _: 'pageBlockDetails',
    open: !!(flags & 0x1),
    blocks: vector(obj),
    title: obj(),
  };
};
const _pageRelatedArticle = (): any => {
  const flags = i32();
  return {
    _: 'pageRelatedArticle',
    url: str(),
    webpage_id: i64(),
    title: flags & 0x1 ? str() : u,
    description: flags & 0x2 ? str() : u,
    photo_id: flags & 0x4 ? i64() : u,
    author: flags & 0x8 ? str() : u,
    published_date: flags & 0x10 ? i32() : u,
  };
};
const _pageBlockRelatedArticles: any = () => ({ _: 'pageBlockRelatedArticles', title: obj(), articles: vector(obj) });
const _pageBlockMap: any = () => ({ _: 'pageBlockMap', geo: obj(), zoom: i32(), w: i32(), h: i32(), caption: obj() });
const _page = (): any => {
  const flags = i32();
  return {
    _: 'page',
    part: !!(flags & 0x1),
    rtl: !!(flags & 0x2),
    v2: !!(flags & 0x4),
    url: str(),
    blocks: vector(obj),
    photos: vector(obj),
    documents: vector(obj),
  };
};
const _inputPrivacyKeyPhoneP2P: any = () => ({ _: 'inputPrivacyKeyPhoneP2P' });
const _privacyKeyPhoneP2P: any = () => ({ _: 'privacyKeyPhoneP2P' });
const _textAnchor: any = () => ({ _: 'textAnchor', text: obj(), name: str() });
const _helpSupportName: any = () => ({ _: 'help.supportName', name: str() });
const _helpUserInfoEmpty: any = () => ({ _: 'help.userInfoEmpty' });
const _helpUserInfo: any = () => ({ _: 'help.userInfo', message: str(), entities: vector(obj), author: str(), date: i32() });
const _messageActionContactSignUp: any = () => ({ _: 'messageActionContactSignUp' });
const _updateMessagePoll = (): any => {
  const flags = i32();
  return {
    _: 'updateMessagePoll',
    poll_id: i64(),
    poll: flags & 0x1 ? obj() : u,
    results: obj(),
  };
};
const _pollAnswer: any = () => ({ _: 'pollAnswer', text: str(), option: bytes() });
const _poll = (): any => {
  const flags = i32();
  return {
    _: 'poll',
    id: i64(),
    closed: !!(flags & 0x1),
    question: str(),
    answers: vector(obj),
  };
};
const _pollAnswerVoters = (): any => {
  const flags = i32();
  return {
    _: 'pollAnswerVoters',
    chosen: !!(flags & 0x1),
    option: bytes(),
    voters: i32(),
  };
};
const _pollResults = (): any => {
  const flags = i32();
  return {
    _: 'pollResults',
    min: !!(flags & 0x1),
    results: flags & 0x2 ? vector(obj) : u,
    total_voters: flags & 0x4 ? i32() : u,
  };
};
const _inputMediaPoll: any = () => ({ _: 'inputMediaPoll', poll: obj() });
const _messageMediaPoll: any = () => ({ _: 'messageMediaPoll', poll: obj(), results: obj() });
const _chatOnlines: any = () => ({ _: 'chatOnlines', onlines: i32() });
const _statsURL: any = () => ({ _: 'statsURL', url: str() });
const _photoStrippedSize: any = () => ({ _: 'photoStrippedSize', type: str(), bytes: bytes() });
const _chatAdminRights = (): any => {
  const flags = i32();
  return {
    _: 'chatAdminRights',
    change_info: !!(flags & 0x1),
    post_messages: !!(flags & 0x2),
    edit_messages: !!(flags & 0x4),
    delete_messages: !!(flags & 0x8),
    ban_users: !!(flags & 0x10),
    invite_users: !!(flags & 0x20),
    pin_messages: !!(flags & 0x80),
    add_admins: !!(flags & 0x200),
  };
};
const _chatBannedRights = (): any => {
  const flags = i32();
  return {
    _: 'chatBannedRights',
    view_messages: !!(flags & 0x1),
    send_messages: !!(flags & 0x2),
    send_media: !!(flags & 0x4),
    send_stickers: !!(flags & 0x8),
    send_gifs: !!(flags & 0x10),
    send_games: !!(flags & 0x20),
    send_inline: !!(flags & 0x40),
    embed_links: !!(flags & 0x80),
    send_polls: !!(flags & 0x100),
    change_info: !!(flags & 0x400),
    invite_users: !!(flags & 0x8000),
    pin_messages: !!(flags & 0x20000),
    until_date: i32(),
  };
};
const _updateChatDefaultBannedRights: any = () => ({ _: 'updateChatDefaultBannedRights', peer: obj(), default_banned_rights: obj(), version: i32() });
const _inputWallPaper: any = () => ({ _: 'inputWallPaper', id: i64(), access_hash: i64() });
const _inputWallPaperSlug: any = () => ({ _: 'inputWallPaperSlug', slug: str() });
const _channelParticipantsContacts: any = () => ({ _: 'channelParticipantsContacts', q: str() });
const _channelAdminLogEventActionDefaultBannedRights: any = () => ({ _: 'channelAdminLogEventActionDefaultBannedRights', prev_banned_rights: obj(), new_banned_rights: obj() });
const _channelAdminLogEventActionStopPoll: any = () => ({ _: 'channelAdminLogEventActionStopPoll', message: obj() });
const _accountWallPapersNotModified: any = () => ({ _: 'account.wallPapersNotModified' });
const _accountWallPapers: any = () => ({ _: 'account.wallPapers', hash: i32(), wallpapers: vector(obj) });
const _codeSettings = (): any => {
  const flags = i32();
  return {
    _: 'codeSettings',
    allow_flashcall: !!(flags & 0x1),
    current_number: !!(flags & 0x2),
    allow_app_hash: !!(flags & 0x10),
  };
};
const _wallPaperSettings = (): any => {
  const flags = i32();
  return {
    _: 'wallPaperSettings',
    blur: !!(flags & 0x2),
    motion: !!(flags & 0x4),
    background_color: flags & 0x1 ? i32() : u,
    intensity: flags & 0x8 ? i32() : u,
  };
};
const _autoDownloadSettings = (): any => {
  const flags = i32();
  return {
    _: 'autoDownloadSettings',
    disabled: !!(flags & 0x1),
    video_preload_large: !!(flags & 0x2),
    audio_preload_next: !!(flags & 0x4),
    phonecalls_less_data: !!(flags & 0x8),
    photo_size_max: i32(),
    video_size_max: i32(),
    file_size_max: i32(),
  };
};
const _accountAutoDownloadSettings: any = () => ({ _: 'account.autoDownloadSettings', low: obj(), medium: obj(), high: obj() });
const _emojiKeyword: any = () => ({ _: 'emojiKeyword', keyword: str(), emoticons: vector(str) });
const _emojiKeywordDeleted: any = () => ({ _: 'emojiKeywordDeleted', keyword: str(), emoticons: vector(str) });
const _emojiKeywordsDifference: any = () => ({ _: 'emojiKeywordsDifference', lang_code: str(), from_version: i32(), version: i32(), keywords: vector(obj) });
const _emojiURL: any = () => ({ _: 'emojiURL', url: str() });
const _emojiLanguage: any = () => ({ _: 'emojiLanguage', lang_code: str() });
const _inputPrivacyKeyForwards: any = () => ({ _: 'inputPrivacyKeyForwards' });
const _privacyKeyForwards: any = () => ({ _: 'privacyKeyForwards' });
const _inputPrivacyKeyProfilePhoto: any = () => ({ _: 'inputPrivacyKeyProfilePhoto' });
const _privacyKeyProfilePhoto: any = () => ({ _: 'privacyKeyProfilePhoto' });
const _fileLocationToBeDeprecated: any = () => ({ _: 'fileLocationToBeDeprecated', volume_id: i64(), local_id: i32() });
const _inputPhotoFileLocation: any = () => ({ _: 'inputPhotoFileLocation', id: i64(), access_hash: i64(), file_reference: bytes(), thumb_size: str() });
const _inputPeerPhotoFileLocation = (): any => {
  const flags = i32();
  return {
    _: 'inputPeerPhotoFileLocation',
    big: !!(flags & 0x1),
    peer: obj(),
    volume_id: i64(),
    local_id: i32(),
  };
};
const _inputStickerSetThumb: any = () => ({ _: 'inputStickerSetThumb', stickerset: obj(), volume_id: i64(), local_id: i32() });
const _folder = (): any => {
  const flags = i32();
  return {
    _: 'folder',
    autofill_new_broadcasts: !!(flags & 0x1),
    autofill_public_groups: !!(flags & 0x2),
    autofill_new_correspondents: !!(flags & 0x4),
    id: i32(),
    title: str(),
    photo: flags & 0x8 ? obj() : u,
  };
};
const _dialogFolder = (): any => {
  const flags = i32();
  return {
    _: 'dialogFolder',
    pinned: !!(flags & 0x4),
    folder: obj(),
    peer: obj(),
    top_message: i32(),
    unread_muted_peers_count: i32(),
    unread_unmuted_peers_count: i32(),
    unread_muted_messages_count: i32(),
    unread_unmuted_messages_count: i32(),
  };
};
const _inputDialogPeerFolder: any = () => ({ _: 'inputDialogPeerFolder', folder_id: i32() });
const _dialogPeerFolder: any = () => ({ _: 'dialogPeerFolder', folder_id: i32() });
const _inputFolderPeer: any = () => ({ _: 'inputFolderPeer', peer: obj(), folder_id: i32() });
const _folderPeer: any = () => ({ _: 'folderPeer', peer: obj(), folder_id: i32() });
const _updateFolderPeers: any = () => ({ _: 'updateFolderPeers', folder_peers: vector(obj), pts: i32(), pts_count: i32() });
const _inputUserFromMessage: any = () => ({ _: 'inputUserFromMessage', peer: obj(), msg_id: i32(), user_id: i32() });
const _inputChannelFromMessage: any = () => ({ _: 'inputChannelFromMessage', peer: obj(), msg_id: i32(), channel_id: i32() });
const _inputPeerUserFromMessage: any = () => ({ _: 'inputPeerUserFromMessage', peer: obj(), msg_id: i32(), user_id: i32() });
const _inputPeerChannelFromMessage: any = () => ({ _: 'inputPeerChannelFromMessage', peer: obj(), msg_id: i32(), channel_id: i32() });
const _inputPrivacyKeyPhoneNumber: any = () => ({ _: 'inputPrivacyKeyPhoneNumber' });
const _privacyKeyPhoneNumber: any = () => ({ _: 'privacyKeyPhoneNumber' });
const _topPeerCategoryForwardUsers: any = () => ({ _: 'topPeerCategoryForwardUsers' });
const _topPeerCategoryForwardChats: any = () => ({ _: 'topPeerCategoryForwardChats' });
const _channelAdminLogEventActionChangeLinkedChat: any = () => ({ _: 'channelAdminLogEventActionChangeLinkedChat', prev_value: i32(), new_value: i32() });
const _messagesSearchCounter = (): any => {
  const flags = i32();
  return {
    _: 'messages.searchCounter',
    inexact: !!(flags & 0x2),
    filter: obj(),
    count: i32(),
  };
};
const _keyboardButtonUrlAuth = (): any => {
  const flags = i32();
  return {
    _: 'keyboardButtonUrlAuth',
    text: str(),
    fwd_text: flags & 0x1 ? str() : u,
    url: str(),
    button_id: i32(),
  };
};
const _inputKeyboardButtonUrlAuth = (): any => {
  const flags = i32();
  return {
    _: 'inputKeyboardButtonUrlAuth',
    request_write_access: !!(flags & 0x1),
    text: str(),
    fwd_text: flags & 0x2 ? str() : u,
    url: str(),
    bot: obj(),
  };
};
const _urlAuthResultRequest = (): any => {
  const flags = i32();
  return {
    _: 'urlAuthResultRequest',
    request_write_access: !!(flags & 0x1),
    bot: obj(),
    domain: str(),
  };
};
const _urlAuthResultAccepted: any = () => ({ _: 'urlAuthResultAccepted', url: str() });
const _urlAuthResultDefault: any = () => ({ _: 'urlAuthResultDefault' });
const _inputPrivacyValueAllowChatParticipants: any = () => ({ _: 'inputPrivacyValueAllowChatParticipants', chats: vector(i32) });
const _inputPrivacyValueDisallowChatParticipants: any = () => ({ _: 'inputPrivacyValueDisallowChatParticipants', chats: vector(i32) });
const _privacyValueAllowChatParticipants: any = () => ({ _: 'privacyValueAllowChatParticipants', chats: vector(i32) });
const _privacyValueDisallowChatParticipants: any = () => ({ _: 'privacyValueDisallowChatParticipants', chats: vector(i32) });
const _messageEntityUnderline: any = () => ({ _: 'messageEntityUnderline', offset: i32(), length: i32() });
const _messageEntityStrike: any = () => ({ _: 'messageEntityStrike', offset: i32(), length: i32() });
const _messageEntityBlockquote: any = () => ({ _: 'messageEntityBlockquote', offset: i32(), length: i32() });
const _updatePeerSettings: any = () => ({ _: 'updatePeerSettings', peer: obj(), settings: obj() });
const _channelLocationEmpty: any = () => ({ _: 'channelLocationEmpty' });
const _channelLocation: any = () => ({ _: 'channelLocation', geo_point: obj(), address: str() });
const _peerLocated: any = () => ({ _: 'peerLocated', peer: obj(), expires: i32(), distance: i32() });
const _updatePeerLocated: any = () => ({ _: 'updatePeerLocated', peers: vector(obj) });
const _channelAdminLogEventActionChangeLocation: any = () => ({ _: 'channelAdminLogEventActionChangeLocation', prev_value: obj(), new_value: obj() });
const _inputReportReasonGeoIrrelevant: any = () => ({ _: 'inputReportReasonGeoIrrelevant' });
const _channelAdminLogEventActionToggleSlowMode: any = () => ({ _: 'channelAdminLogEventActionToggleSlowMode', prev_value: i32(), new_value: i32() });
const _authAuthorizationSignUpRequired = (): any => {
  const flags = i32();
  return {
    _: 'auth.authorizationSignUpRequired',
    terms_of_service: flags & 0x1 ? obj() : u,
  };
};
const _paymentsPaymentVerificationNeeded: any = () => ({ _: 'payments.paymentVerificationNeeded', url: str() });
const _inputStickerSetAnimatedEmoji: any = () => ({ _: 'inputStickerSetAnimatedEmoji' });
const _updateNewScheduledMessage: any = () => ({ _: 'updateNewScheduledMessage', message: obj() });
const _updateDeleteScheduledMessages: any = () => ({ _: 'updateDeleteScheduledMessages', peer: obj(), messages: vector(i32) });
const _restrictionReason: any = () => ({ _: 'restrictionReason', platform: str(), reason: str(), text: str() });
const _inputTheme: any = () => ({ _: 'inputTheme', id: i64(), access_hash: i64() });
const _inputThemeSlug: any = () => ({ _: 'inputThemeSlug', slug: str() });
const _themeDocumentNotModified: any = () => ({ _: 'themeDocumentNotModified' });
const _theme = (): any => {
  const flags = i32();
  return {
    _: 'theme',
    creator: !!(flags & 0x1),
    default: !!(flags & 0x2),
    id: i64(),
    access_hash: i64(),
    slug: str(),
    title: str(),
    document: flags & 0x4 ? obj() : u,
    installs_count: i32(),
  };
};
const _accountThemesNotModified: any = () => ({ _: 'account.themesNotModified' });
const _accountThemes: any = () => ({ _: 'account.themes', hash: i32(), themes: vector(obj) });
const _updateTheme: any = () => ({ _: 'updateTheme', theme: obj() });
const _inputPrivacyKeyAddedByPhone: any = () => ({ _: 'inputPrivacyKeyAddedByPhone' });
const _privacyKeyAddedByPhone: any = () => ({ _: 'privacyKeyAddedByPhone' });

const parserMap = new Map<number, () => any>([
  [0x1cb5c415, _vector],
  [0x5162463, _resPQ],
  [0x83c95aec, _p_q_inner_data],
  [0xa9f55f95, _p_q_inner_data_dc],
  [0x3c6a84d4, _p_q_inner_data_temp],
  [0x56fddf88, _p_q_inner_data_temp_dc],
  [0x79cb045d, _server_DH_params_fail],
  [0xd0e8075c, _server_DH_params_ok],
  [0xb5890dba, _server_DH_inner_data],
  [0x6643b654, _client_DH_inner_data],
  [0x3bcbf734, _dh_gen_ok],
  [0x46dc1fb9, _dh_gen_retry],
  [0xa69dae02, _dh_gen_fail],
  [0xf35c6d01, _rpc_result],
  [0x2144ca19, _rpc_error],
  [0x5e2ad36e, _rpc_answer_unknown],
  [0xcd78e586, _rpc_answer_dropped_running],
  [0xa43ad8b7, _rpc_answer_dropped],
  [0x949d9dc, _future_salt],
  [0xae500895, _future_salts],
  [0x347773c5, _pong],
  [0x9ec20908, _new_session_created],
  [0x73f1f8dc, _msg_container],
  [0x5bb8e511, _message],
  [0xe06046b2, _msg_copy],
  [0x3072cfa1, _gzip_packed],
  [0x62d6b459, _msgs_ack],
  [0xa7eff811, _bad_msg_notification],
  [0xedab447b, _bad_server_salt],
  [0x7d861a08, _msg_resend_req],
  [0x8610baeb, _msg_resend_ans_req],
  [0xda69fb52, _msgs_state_req],
  [0x4deb57d, _msgs_state_info],
  [0x8cc0d131, _msgs_all_info],
  [0x276d3ec6, _msg_detailed_info],
  [0x809db6df, _msg_new_detailed_info],
  [0x75a3f765, _bind_auth_key_inner],
  [0xf660e1d4, _destroy_auth_key_ok],
  [0xa9f2259, _destroy_auth_key_none],
  [0xea109b13, _destroy_auth_key_fail],
  [0xe22045fc, _destroy_session_ok],
  [0x62d350c9, _destroy_session_none],
  [0xbc799737, _boolFalse],
  [0x997275b5, _boolTrue],
  [0x3fedd339, _true],
  [0xc4b9f9bb, _error],
  [0x56730bcc, _null],
  [0x7f3b18ea, _inputPeerEmpty],
  [0x7da07ec9, _inputPeerSelf],
  [0x179be863, _inputPeerChat],
  [0xb98886cf, _inputUserEmpty],
  [0xf7c1b13f, _inputUserSelf],
  [0xf392b7f4, _inputPhoneContact],
  [0xf52ff27f, _inputFile],
  [0x9664f57f, _inputMediaEmpty],
  [0x1e287d04, _inputMediaUploadedPhoto],
  [0xb3ba0635, _inputMediaPhoto],
  [0xf9c44144, _inputMediaGeoPoint],
  [0xf8ab7dfb, _inputMediaContact],
  [0x1ca48f57, _inputChatPhotoEmpty],
  [0x927c55b4, _inputChatUploadedPhoto],
  [0x8953ad37, _inputChatPhoto],
  [0xe4c123d6, _inputGeoPointEmpty],
  [0xf3b7acc9, _inputGeoPoint],
  [0x1cd7bf0d, _inputPhotoEmpty],
  [0x3bb3b94a, _inputPhoto],
  [0xdfdaabe1, _inputFileLocation],
  [0x9db1bc6d, _peerUser],
  [0xbad0e5bb, _peerChat],
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
  [0x4f11bae1, _userProfilePhotoEmpty],
  [0xecd75d8c, _userProfilePhoto],
  [0x9d05049, _userStatusEmpty],
  [0xedb93949, _userStatusOnline],
  [0x8c703f, _userStatusOffline],
  [0x9ba2d800, _chatEmpty],
  [0x3bda1bde, _chat],
  [0x7328bdb, _chatForbidden],
  [0x1b7c9db3, _chatFull],
  [0xc8d7493e, _chatParticipant],
  [0xfc900c2b, _chatParticipantsForbidden],
  [0x3f460fed, _chatParticipants],
  [0x37c1011c, _chatPhotoEmpty],
  [0x475cdbd5, _chatPhoto],
  [0x83e5de54, _messageEmpty],
  [0x9e19a1f6, _messageService],
  [0x3ded6320, _messageMediaEmpty],
  [0x695150d7, _messageMediaPhoto],
  [0x56e0d474, _messageMediaGeo],
  [0xcbf24940, _messageMediaContact],
  [0x9f84f49e, _messageMediaUnsupported],
  [0xb6aef7b0, _messageActionEmpty],
  [0xa6638b9a, _messageActionChatCreate],
  [0xb5a1ce5a, _messageActionChatEditTitle],
  [0x7fcb13a8, _messageActionChatEditPhoto],
  [0x95e3fbef, _messageActionChatDeletePhoto],
  [0x488a7337, _messageActionChatAddUser],
  [0xb2ae9b0c, _messageActionChatDeleteUser],
  [0x2c171f72, _dialog],
  [0x2331b22d, _photoEmpty],
  [0xd07504a5, _photo],
  [0xe17e23c, _photoSizeEmpty],
  [0x77bfb61b, _photoSize],
  [0xe9a734fa, _photoCachedSize],
  [0x1117dd5f, _geoPointEmpty],
  [0x296f104, _geoPoint],
  [0x5e002502, _authSentCode],
  [0xcd050916, _authAuthorization],
  [0xdf969c2d, _authExportedAuthorization],
  [0xb8bc5b0c, _inputNotifyPeer],
  [0x193b4417, _inputNotifyUsers],
  [0x4a95e84e, _inputNotifyChats],
  [0x9c3d198e, _inputPeerNotifySettings],
  [0xaf509d20, _peerNotifySettings],
  [0x818426cd, _peerSettings],
  [0xa437c3ed, _wallPaper],
  [0x58dbcab8, _inputReportReasonSpam],
  [0x1e22c78d, _inputReportReasonViolence],
  [0x2e59d922, _inputReportReasonPornography],
  [0xadf44ee3, _inputReportReasonChildAbuse],
  [0xe1746d0a, _inputReportReasonOther],
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
  [0x8c718e87, _messagesMessages],
  [0xc8edce1e, _messagesMessagesSlice],
  [0x64ff9fd5, _messagesChats],
  [0xe5d7d19c, _messagesChatFull],
  [0xb45c69d1, _messagesAffectedHistory],
  [0x57e2f66c, _inputMessagesFilterEmpty],
  [0x9609a51c, _inputMessagesFilterPhotos],
  [0x9fc00e65, _inputMessagesFilterVideo],
  [0x56e9f0e4, _inputMessagesFilterPhotoVideo],
  [0x9eddf188, _inputMessagesFilterDocument],
  [0x7ef0dd87, _inputMessagesFilterUrl],
  [0xffc86587, _inputMessagesFilterGif],
  [0x1f2b0afd, _updateNewMessage],
  [0x4e90bfd6, _updateMessageID],
  [0xa20db0e5, _updateDeleteMessages],
  [0x5c486927, _updateUserTyping],
  [0x9a65ea1f, _updateChatUserTyping],
  [0x7761198, _updateChatParticipants],
  [0x1bfbd823, _updateUserStatus],
  [0xa7332b73, _updateUserName],
  [0x95313b0c, _updateUserPhoto],
  [0xa56c2a3e, _updatesState],
  [0x5d75a138, _updatesDifferenceEmpty],
  [0xf49ca0, _updatesDifference],
  [0xa8fb1981, _updatesDifferenceSlice],
  [0xe317af7e, _updatesTooLong],
  [0x914fbf11, _updateShortMessage],
  [0x16812688, _updateShortChatMessage],
  [0x78d4dec1, _updateShort],
  [0x725b04c3, _updatesCombined],
  [0x74ae4240, _updates],
  [0x8dca6aa5, _photosPhotos],
  [0x15051f54, _photosPhotosSlice],
  [0x20212ca8, _photosPhoto],
  [0x96a18d5, _uploadFile],
  [0x18b7a10d, _dcOption],
  [0x330b4067, _config],
  [0x8e1a1775, _nearestDc],
  [0x1da7158f, _helpAppUpdate],
  [0xc45a6536, _helpNoAppUpdate],
  [0x18cb9f78, _helpInviteText],
  [0x12bcbd9a, _updateNewEncryptedMessage],
  [0x1710f156, _updateEncryptedChatTyping],
  [0xb4a2e88d, _updateEncryption],
  [0x38fe25b7, _updateEncryptedMessagesRead],
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
  [0xf5235d55, _inputEncryptedFileLocation],
  [0xed18c118, _encryptedMessage],
  [0x23734b06, _encryptedMessageService],
  [0xc0e24635, _messagesDhConfigNotModified],
  [0x2c221edd, _messagesDhConfig],
  [0x560f8935, _messagesSentEncryptedMessage],
  [0x9493ff32, _messagesSentEncryptedFile],
  [0xfa4f0bb5, _inputFileBig],
  [0x2dc173c8, _inputEncryptedFileBigUploaded],
  [0xea4b0e5c, _updateChatParticipantAdd],
  [0x6e5f8c22, _updateChatParticipantDelete],
  [0x8e5e9873, _updateDcOptions],
  [0x5b38c6c1, _inputMediaUploadedDocument],
  [0x23ab23d2, _inputMediaDocument],
  [0x9cb070d7, _messageMediaDocument],
  [0x72f0eaae, _inputDocumentEmpty],
  [0x1abfb575, _inputDocument],
  [0xbad07584, _inputDocumentFileLocation],
  [0x36f8c871, _documentEmpty],
  [0x9ba29cc1, _document],
  [0x17c6b5f6, _helpSupport],
  [0x9fd40bd8, _notifyPeer],
  [0xb4c83b4c, _notifyUsers],
  [0xc007cec3, _notifyChats],
  [0x80ece81a, _updateUserBlocked],
  [0xbec268ef, _updateNotifySettings],
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
  [0xb3134d9d, _contactsFound],
  [0xebe46819, _updateServiceNotification],
  [0xe26f42f1, _userStatusRecently],
  [0x7bf09fc, _userStatusLastWeek],
  [0x77ebc742, _userStatusLastMonth],
  [0xee3b272a, _updatePrivacy],
  [0x4f96cb18, _inputPrivacyKeyStatusTimestamp],
  [0xbc2eab30, _privacyKeyStatusTimestamp],
  [0xd09e07b, _inputPrivacyValueAllowContacts],
  [0x184b35ce, _inputPrivacyValueAllowAll],
  [0x131cc67f, _inputPrivacyValueAllowUsers],
  [0xba52007, _inputPrivacyValueDisallowContacts],
  [0xd66b66c9, _inputPrivacyValueDisallowAll],
  [0x90110467, _inputPrivacyValueDisallowUsers],
  [0xfffe1bac, _privacyValueAllowContacts],
  [0x65427b82, _privacyValueAllowAll],
  [0x4d5bbe0c, _privacyValueAllowUsers],
  [0xf888fa1a, _privacyValueDisallowContacts],
  [0x8b73e763, _privacyValueDisallowAll],
  [0xc7f49b7, _privacyValueDisallowUsers],
  [0x50a04e45, _accountPrivacyRules],
  [0xb8d0afdf, _accountDaysTTL],
  [0x12b9417b, _updateUserPhone],
  [0x6c37c15c, _documentAttributeImageSize],
  [0x11b58939, _documentAttributeAnimated],
  [0x6319d612, _documentAttributeSticker],
  [0xef02ce6, _documentAttributeVideo],
  [0x9852f9c6, _documentAttributeAudio],
  [0x15590068, _documentAttributeFilename],
  [0xf1749a22, _messagesStickersNotModified],
  [0xe4599bbd, _messagesStickers],
  [0x12b299d4, _stickerPack],
  [0xe86602c3, _messagesAllStickersNotModified],
  [0xedfd405f, _messagesAllStickers],
  [0x9c974fdf, _updateReadHistoryInbox],
  [0x2f2f21bf, _updateReadHistoryOutbox],
  [0x84d19185, _messagesAffectedMessages],
  [0x7f891213, _updateWebPage],
  [0xeb1477e8, _webPageEmpty],
  [0xc586da1c, _webPagePending],
  [0xfa64e172, _webPage],
  [0xa32dd600, _messageMediaWebPage],
  [0xad01d61d, _authorization],
  [0x1250abde, _accountAuthorizations],
  [0xad2641f8, _accountPassword],
  [0x9a5c33e5, _accountPasswordSettings],
  [0xc23727c9, _accountPasswordInputSettings],
  [0x137948a5, _authPasswordRecovery],
  [0xc13d1c11, _inputMediaVenue],
  [0x2ec0533f, _messageMediaVenue],
  [0xa384b779, _receivedNotifyMessage],
  [0x69df3769, _chatInviteEmpty],
  [0xfc2e05bc, _chatInviteExported],
  [0x5a686d7c, _chatInviteAlready],
  [0xdfc2f58e, _chatInvite],
  [0xf89cf5e8, _messageActionChatJoinedByLink],
  [0x68c13933, _updateReadMessagesContents],
  [0xffb62b95, _inputStickerSetEmpty],
  [0x9de7a269, _inputStickerSetID],
  [0x861cc8a0, _inputStickerSetShortName],
  [0xeeb46f27, _stickerSet],
  [0xb60a24a6, _messagesStickerSet],
  [0x938458c1, _user],
  [0xc27ac8c7, _botCommand],
  [0x98e81d3a, _botInfo],
  [0xa2fa4880, _keyboardButton],
  [0x77608b83, _keyboardButtonRow],
  [0xa03e5b85, _replyKeyboardHide],
  [0xf4108aa0, _replyKeyboardForceReply],
  [0x3502758c, _replyKeyboardMarkup],
  [0x7b8e7de6, _inputPeerUser],
  [0xd8292816, _inputUser],
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
  [0x11f1331c, _updateShortSentMessage],
  [0xee8c1e86, _inputChannelEmpty],
  [0xafeb712e, _inputChannel],
  [0xbddde532, _peerChannel],
  [0x20adaef8, _inputPeerChannel],
  [0xd31a961e, _channel],
  [0x289da732, _channelForbidden],
  [0x7f077ad9, _contactsResolvedPeer],
  [0x2d895c74, _channelFull],
  [0xae30253, _messageRange],
  [0x99262e37, _messagesChannelMessages],
  [0x95d2ac92, _messageActionChannelCreate],
  [0xeb0467fb, _updateChannelTooLong],
  [0xb6d45656, _updateChannel],
  [0x62ba04d9, _updateNewChannelMessage],
  [0x330b5424, _updateReadChannelInbox],
  [0xc37521c9, _updateDeleteChannelMessages],
  [0x98a12b4b, _updateChannelMessageViews],
  [0x3e11affb, _updatesChannelDifferenceEmpty],
  [0xa4bcc6fe, _updatesChannelDifferenceTooLong],
  [0x2064674e, _updatesChannelDifference],
  [0x94d42ee7, _channelMessagesFilterEmpty],
  [0xcd77d957, _channelMessagesFilter],
  [0x15ebac1d, _channelParticipant],
  [0xa3289a6d, _channelParticipantSelf],
  [0x808d15a4, _channelParticipantCreator],
  [0xde3f3c79, _channelParticipantsRecent],
  [0xb4608969, _channelParticipantsAdmins],
  [0xa3b54985, _channelParticipantsKicked],
  [0xf56ee2a8, _channelsChannelParticipants],
  [0xd0d9b163, _channelsChannelParticipant],
  [0xda13538a, _chatParticipantCreator],
  [0xe2d6e436, _chatParticipantAdmin],
  [0xb6901959, _updateChatParticipantAdmin],
  [0x51bdb021, _messageActionChatMigrateTo],
  [0xb055eaee, _messageActionChannelMigrateFrom],
  [0xb0d1865b, _channelParticipantsBots],
  [0x780a0310, _helpTermsOfService],
  [0x688a30aa, _updateNewStickerSet],
  [0xbb2d201, _updateStickerSetsOrder],
  [0x43ae3dec, _updateStickerSets],
  [0x162ecc1f, _foundGif],
  [0x9c750409, _foundGifCached],
  [0x4843b0fd, _inputMediaGifExternal],
  [0x450a1c0a, _messagesFoundGifs],
  [0xe8025ca2, _messagesSavedGifsNotModified],
  [0x2e0709a5, _messagesSavedGifs],
  [0x9375341e, _updateSavedGifs],
  [0x3380c786, _inputBotInlineMessageMediaAuto],
  [0x3dcd7a87, _inputBotInlineMessageText],
  [0x88bf9319, _inputBotInlineResult],
  [0x764cf810, _botInlineMessageMediaAuto],
  [0x8c7f65e2, _botInlineMessageText],
  [0x11965f3a, _botInlineResult],
  [0x947ca848, _messagesBotResults],
  [0x54826690, _updateBotInlineQuery],
  [0xe48f964, _updateBotInlineSend],
  [0x50f5c392, _inputMessagesFilterVoice],
  [0x3751b49e, _inputMessagesFilterMusic],
  [0xbdfb0426, _inputPrivacyKeyChatInvite],
  [0x500e6dfa, _privacyKeyChatInvite],
  [0x5dab1af4, _exportedMessageLink],
  [0xec338270, _messageFwdHeader],
  [0x1b3f4df7, _updateEditChannelMessage],
  [0x98592475, _updateChannelPinnedMessage],
  [0x94bd38ed, _messageActionPinMessage],
  [0x72a3158c, _authCodeTypeSms],
  [0x741cd3e3, _authCodeTypeCall],
  [0x226ccefb, _authCodeTypeFlashCall],
  [0x3dbb5986, _authSentCodeTypeApp],
  [0xc000bba2, _authSentCodeTypeSms],
  [0x5353e5a7, _authSentCodeTypeCall],
  [0xab03c6d9, _authSentCodeTypeFlashCall],
  [0x258aff05, _keyboardButtonUrl],
  [0x683a5e46, _keyboardButtonCallback],
  [0xb16a6c29, _keyboardButtonRequestPhone],
  [0xfc796b3f, _keyboardButtonRequestGeoLocation],
  [0x568a748, _keyboardButtonSwitchInline],
  [0x48a30254, _replyInlineMarkup],
  [0x36585ea4, _messagesBotCallbackAnswer],
  [0xe73547e1, _updateBotCallbackQuery],
  [0x26b5dde6, _messagesMessageEditData],
  [0xe40370a3, _updateEditMessage],
  [0xc1b15d65, _inputBotInlineMessageMediaGeo],
  [0x417bbf11, _inputBotInlineMessageMediaVenue],
  [0xa6edbffd, _inputBotInlineMessageMediaContact],
  [0xb722de65, _botInlineMessageMediaGeo],
  [0x8a86659c, _botInlineMessageMediaVenue],
  [0x18d1cdc2, _botInlineMessageMediaContact],
  [0xa8d864a7, _inputBotInlineResultPhoto],
  [0xfff8fdc4, _inputBotInlineResultDocument],
  [0x17db940b, _botInlineMediaResult],
  [0x890c3d89, _inputBotInlineMessageID],
  [0xf9d27a5a, _updateInlineBotCallbackQuery],
  [0x3c20629f, _inlineBotSwitchPM],
  [0x3371c354, _messagesPeerDialogs],
  [0xedcdc05b, _topPeer],
  [0xab661b5b, _topPeerCategoryBotsPM],
  [0x148677e2, _topPeerCategoryBotsInline],
  [0x637b7ed, _topPeerCategoryCorrespondents],
  [0xbd17a14a, _topPeerCategoryGroups],
  [0x161d9628, _topPeerCategoryChannels],
  [0xfb834291, _topPeerCategoryPeers],
  [0xde266ef5, _contactsTopPeersNotModified],
  [0x70b772a8, _contactsTopPeers],
  [0x352dca58, _messageEntityMentionName],
  [0x208e68c9, _inputMessageEntityMentionName],
  [0x3a20ecb8, _inputMessagesFilterChatPhotos],
  [0x25d6c9c7, _updateReadChannelOutbox],
  [0xee2bb969, _updateDraftMessage],
  [0x1b0c841a, _draftMessageEmpty],
  [0xfd8e711f, _draftMessage],
  [0x9fbab604, _messageActionHistoryClear],
  [0x4ede3cf, _messagesFeaturedStickersNotModified],
  [0xf89d88e5, _messagesFeaturedStickers],
  [0x571d2742, _updateReadFeaturedStickers],
  [0xb17f890, _messagesRecentStickersNotModified],
  [0x22f3afb3, _messagesRecentStickers],
  [0x9a422c20, _updateRecentStickers],
  [0x4fcba9c8, _messagesArchivedStickers],
  [0x38641628, _messagesStickerSetInstallResultSuccess],
  [0x35e410a8, _messagesStickerSetInstallResultArchive],
  [0x6410a5d2, _stickerSetCovered],
  [0xa229dd06, _updateConfig],
  [0x3354678f, _updatePtsChanged],
  [0xe5bbfe1a, _inputMediaPhotoExternal],
  [0xfb52dc99, _inputMediaDocumentExternal],
  [0x3407e51b, _stickerSetMultiCovered],
  [0xaed6dbb2, _maskCoords],
  [0x9801d2f7, _documentAttributeHasStickers],
  [0x4a992157, _inputStickeredMediaPhoto],
  [0x438865b, _inputStickeredMediaDocument],
  [0xbdf9653b, _game],
  [0x4fa417f2, _inputBotInlineResultGame],
  [0x4b425864, _inputBotInlineMessageGame],
  [0xfdb19008, _messageMediaGame],
  [0xd33f43f3, _inputMediaGame],
  [0x32c3e77, _inputGameID],
  [0xc331e80a, _inputGameShortName],
  [0x50f41ccf, _keyboardButtonGame],
  [0x92a72876, _messageActionGameScore],
  [0x58fffcd0, _highScore],
  [0x9a3bfd99, _messagesHighScores],
  [0x4afe8f6d, _updatesDifferenceTooLong],
  [0x40771900, _updateChannelWebPage],
  [0x9cd81144, _messagesChatsSlice],
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
  [0x85849473, _webPageNotModified],
  [0xfabadc5f, _inputPrivacyKeyPhoneCall],
  [0x3d662b7b, _privacyKeyPhoneCall],
  [0xdd6a8f48, _sendMessageGamePlayAction],
  [0x85e42301, _phoneCallDiscardReasonMissed],
  [0xe095c1a0, _phoneCallDiscardReasonDisconnect],
  [0x57adc690, _phoneCallDiscardReasonHangup],
  [0xfaf7e8c9, _phoneCallDiscardReasonBusy],
  [0x6e6fe51c, _updateDialogPinned],
  [0xfa0f3ca2, _updatePinnedDialogs],
  [0x7d748d04, _dataJSON],
  [0x8317c0c3, _updateBotWebhookJSON],
  [0x9b9240a6, _updateBotWebhookJSONQuery],
  [0xcb296bf8, _labeledPrice],
  [0xc30aa358, _invoice],
  [0xf4e096c3, _inputMediaInvoice],
  [0xea02c27e, _paymentCharge],
  [0x8f31b327, _messageActionPaymentSentMe],
  [0x84551347, _messageMediaInvoice],
  [0x1e8caaeb, _postAddress],
  [0x909c3f94, _paymentRequestedInfo],
  [0xafd93fbb, _keyboardButtonBuy],
  [0x40699cd0, _messageActionPaymentSent],
  [0xcdc27a1f, _paymentSavedCredentialsCard],
  [0x1c570ed1, _webDocument],
  [0x9bed434d, _inputWebDocument],
  [0xc239d686, _inputWebFileLocation],
  [0x21e753bc, _uploadWebFile],
  [0x3f56aea3, _paymentsPaymentForm],
  [0xd1451883, _paymentsValidatedRequestedInfo],
  [0x4e5f810d, _paymentsPaymentResult],
  [0x500911e1, _paymentsPaymentReceipt],
  [0xfb8fe43c, _paymentsSavedInfo],
  [0xc10eb2cf, _inputPaymentCredentialsSaved],
  [0x3417d728, _inputPaymentCredentials],
  [0xdb64fd34, _accountTmpPassword],
  [0xb6213cdf, _shippingOption],
  [0xe0cdc940, _updateBotShippingQuery],
  [0x5d2f3aa9, _updateBotPrecheckoutQuery],
  [0xffa0a496, _inputStickerSetItem],
  [0xab0f6b1e, _updatePhoneCall],
  [0x1e36fded, _inputPhoneCall],
  [0x5366c915, _phoneCallEmpty],
  [0x1b8f4ad1, _phoneCallWaiting],
  [0x87eabb53, _phoneCallRequested],
  [0x997c454a, _phoneCallAccepted],
  [0x8742ae7f, _phoneCall],
  [0x50ca4de1, _phoneCallDiscarded],
  [0x9d4c17c0, _phoneConnection],
  [0xa2bb35cb, _phoneCallProtocol],
  [0xec82e140, _phonePhoneCall],
  [0x80c99768, _inputMessagesFilterPhoneCalls],
  [0x80e11a7f, _messageActionPhoneCall],
  [0x7a7c17a4, _inputMessagesFilterRoundVoice],
  [0xb549da53, _inputMessagesFilterRoundVideo],
  [0x88f27fbc, _sendMessageRecordRoundAction],
  [0x243e1c66, _sendMessageUploadRoundAction],
  [0xf18cda44, _uploadFileCdnRedirect],
  [0xeea8e46e, _uploadCdnFileReuploadNeeded],
  [0xa99fca4f, _uploadCdnFile],
  [0xc982eaba, _cdnPublicKey],
  [0x5725e40a, _cdnConfig],
  [0xef1751b5, _pageBlockChannel],
  [0xcad181f6, _langPackString],
  [0x6c47ac9f, _langPackStringPluralized],
  [0x2979eeb2, _langPackStringDeleted],
  [0xf385c1f6, _langPackDifference],
  [0xeeca5ce3, _langPackLanguage],
  [0x46560264, _updateLangPackTooLong],
  [0x56022f4d, _updateLangPack],
  [0xccbebbaf, _channelParticipantAdmin],
  [0x1c0facaf, _channelParticipantBanned],
  [0x1427a5e1, _channelParticipantsBanned],
  [0x656ac4b, _channelParticipantsSearch],
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
  [0x3b5a3e40, _channelAdminLogEvent],
  [0xed8af74d, _channelsAdminLogResults],
  [0xea107ae4, _channelAdminLogEventsFilter],
  [0x1e76a78c, _topPeerCategoryPhoneCalls],
  [0x804361ea, _pageBlockAudio],
  [0x5ce14175, _popularContact],
  [0x4792929b, _messageActionScreenshotTaken],
  [0x9e8fa6d3, _messagesFavedStickersNotModified],
  [0xf37f2f16, _messagesFavedStickers],
  [0xe511996d, _updateFavedStickers],
  [0x89893b45, _updateChannelReadMessagesContents],
  [0xc1f8e69a, _inputMessagesFilterMyMentions],
  [0x7084a7be, _updateContactsReset],
  [0xb1c3caa7, _channelAdminLogEventActionChangeStickerSet],
  [0xfae69f56, _messageActionCustomAction],
  [0xaa1c39f, _inputPaymentCredentialsApplePay],
  [0xca05d50e, _inputPaymentCredentialsAndroidPay],
  [0xe7026d0d, _inputMessagesFilterGeo],
  [0xe062db83, _inputMessagesFilterContacts],
  [0x70db6837, _updateChannelAvailableMessages],
  [0x5f5c95f1, _channelAdminLogEventActionTogglePreHistoryHidden],
  [0xce4e82fd, _inputMediaGeoLive],
  [0x7c3c2609, _messageMediaGeoLive],
  [0x46e1d13d, _recentMeUrlUnknown],
  [0x8dbc3336, _recentMeUrlUser],
  [0xa01b22f9, _recentMeUrlChat],
  [0xeb49081d, _recentMeUrlChatInvite],
  [0xbc0a57dc, _recentMeUrlStickerSet],
  [0xe0310d7, _helpRecentMeUrls],
  [0xf0173fe9, _channelsChannelParticipantsNotModified],
  [0x74535f21, _messagesMessagesNotModified],
  [0x1cc6e91f, _inputSingleMedia],
  [0xcac943f2, _webAuthorization],
  [0xed56c9fc, _accountWebAuthorizations],
  [0xa676a322, _inputMessageID],
  [0xbad88395, _inputMessageReplyTo],
  [0x86872538, _inputMessagePinned],
  [0x9b69e34b, _messageEntityPhone],
  [0x4c4e743f, _messageEntityCashtag],
  [0xabe9affe, _messageActionBotAllowed],
  [0xfcaafeb7, _inputDialogPeer],
  [0xe56dbf05, _dialogPeer],
  [0xd54b65d, _messagesFoundStickerSetsNotModified],
  [0x5108d648, _messagesFoundStickerSets],
  [0x6242c773, _fileHash],
  [0xf9c8bcc6, _webDocumentNoProxy],
  [0x75588b3f, _inputClientProxy],
  [0xe09e1fb8, _helpProxyDataEmpty],
  [0x2bf7ee23, _helpProxyDataPromo],
  [0xe3309f7f, _helpTermsOfServiceUpdateEmpty],
  [0x28ecf961, _helpTermsOfServiceUpdate],
  [0x3334b0f0, _inputSecureFileUploaded],
  [0x5367e5be, _inputSecureFile],
  [0xcbc7ee28, _inputSecureFileLocation],
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
  [0x33f0ea47, _secureCredentialsEncrypted],
  [0xad2e1cd8, _accountAuthorizationForm],
  [0x811f854f, _accountSentEmailCode],
  [0x1b287353, _messageActionSecureValuesSentMe],
  [0xd95c6154, _messageActionSecureValuesSent],
  [0x66afa166, _helpDeepLinkInfoEmpty],
  [0x6a4ee832, _helpDeepLinkInfo],
  [0x1142bd56, _savedPhoneContact],
  [0x4dba4501, _accountTakeout],
  [0x29be5899, _inputTakeoutFileLocation],
  [0xe16459c3, _updateDialogUnreadMark],
  [0xf0e3e596, _messagesDialogsNotModified],
  [0x9f2221c9, _inputWebFileGeoPointLocation],
  [0xb52c939d, _contactsTopPeersDisabled],
  [0x9b89f93a, _inputReportReasonCopyright],
  [0xd45ab096, _passwordKdfAlgoUnknown],
  [0x4a8537, _securePasswordKdfAlgoUnknown],
  [0xbbf2dda0, _securePasswordKdfAlgoPBKDF2HMACSHA512iter100000],
  [0x86471d92, _securePasswordKdfAlgoSHA512],
  [0x1527bcac, _secureSecretSettings],
  [0x3a912d4a, _passwordKdfAlgoSHA256SHA256PBKDF2HMACSHA512iter100000SHA256ModPow],
  [0x9880f658, _inputCheckPasswordEmpty],
  [0xd27ff082, _inputCheckPasswordSRP],
  [0x869d758f, _secureValueError],
  [0xa1144770, _secureValueErrorTranslationFile],
  [0x34636dd8, _secureValueErrorTranslationFiles],
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
  [0x4c43da18, _updateUserPinnedMessage],
  [0xe10db349, _updateChatPinnedMessage],
  [0xb1db7c7e, _inputNotifyBroadcasts],
  [0xd612e8ef, _notifyBroadcasts],
  [0xed6a8504, _textSubscript],
  [0xc7fb5e01, _textSuperscript],
  [0x34b8621, _textMarked],
  [0x1ccb966a, _textPhone],
  [0x81ccf4f, _textImage],
  [0x1e148390, _pageBlockKicker],
  [0x34566b6a, _pageTableCell],
  [0xe0c0c5e5, _pageTableRow],
  [0xbf4dea82, _pageBlockTable],
  [0x6f747657, _pageCaption],
  [0xb92fb6cd, _pageListItemText],
  [0x25e073fc, _pageListItemBlocks],
  [0x5e068047, _pageListOrderedItemText],
  [0x98dd8936, _pageListOrderedItemBlocks],
  [0x9a8ae1e1, _pageBlockOrderedList],
  [0x76768bed, _pageBlockDetails],
  [0xb390dc08, _pageRelatedArticle],
  [0x16115a96, _pageBlockRelatedArticles],
  [0xa44f3ef6, _pageBlockMap],
  [0xae891bec, _page],
  [0xdb9e70d2, _inputPrivacyKeyPhoneP2P],
  [0x39491cc8, _privacyKeyPhoneP2P],
  [0x35553762, _textAnchor],
  [0x8c05f1c9, _helpSupportName],
  [0xf3ae2eed, _helpUserInfoEmpty],
  [0x1eb3758, _helpUserInfo],
  [0xf3f25f76, _messageActionContactSignUp],
  [0xaca1657b, _updateMessagePoll],
  [0x6ca9c2e9, _pollAnswer],
  [0xd5529d06, _poll],
  [0x3b6ddad2, _pollAnswerVoters],
  [0x5755785a, _pollResults],
  [0x6b3765b, _inputMediaPoll],
  [0x4bd6e798, _messageMediaPoll],
  [0xf041e250, _chatOnlines],
  [0x47a971e0, _statsURL],
  [0xe0b0bc2e, _photoStrippedSize],
  [0x5fb224d5, _chatAdminRights],
  [0x9f120418, _chatBannedRights],
  [0x54c01850, _updateChatDefaultBannedRights],
  [0xe630b979, _inputWallPaper],
  [0x72091c80, _inputWallPaperSlug],
  [0xbb6ae88d, _channelParticipantsContacts],
  [0x2df5fc0a, _channelAdminLogEventActionDefaultBannedRights],
  [0x8f079643, _channelAdminLogEventActionStopPoll],
  [0x1c199183, _accountWallPapersNotModified],
  [0x702b65a9, _accountWallPapers],
  [0xdebebe83, _codeSettings],
  [0xa12f40b8, _wallPaperSettings],
  [0xd246fd47, _autoDownloadSettings],
  [0x63cacf26, _accountAutoDownloadSettings],
  [0xd5b3b9f9, _emojiKeyword],
  [0x236df622, _emojiKeywordDeleted],
  [0x5cc761bd, _emojiKeywordsDifference],
  [0xa575739d, _emojiURL],
  [0xb3fb5361, _emojiLanguage],
  [0xa4dd4c08, _inputPrivacyKeyForwards],
  [0x69ec56a3, _privacyKeyForwards],
  [0x5719bacc, _inputPrivacyKeyProfilePhoto],
  [0x96151fed, _privacyKeyProfilePhoto],
  [0xbc7fc6cd, _fileLocationToBeDeprecated],
  [0x40181ffe, _inputPhotoFileLocation],
  [0x27d69997, _inputPeerPhotoFileLocation],
  [0xdbaeae9, _inputStickerSetThumb],
  [0xff544e65, _folder],
  [0x71bd134c, _dialogFolder],
  [0x64600527, _inputDialogPeerFolder],
  [0x514519e2, _dialogPeerFolder],
  [0xfbd2c296, _inputFolderPeer],
  [0xe9baa668, _folderPeer],
  [0x19360dc0, _updateFolderPeers],
  [0x2d117597, _inputUserFromMessage],
  [0x2a286531, _inputChannelFromMessage],
  [0x17bae2e6, _inputPeerUserFromMessage],
  [0x9c95f7bb, _inputPeerChannelFromMessage],
  [0x352dafa, _inputPrivacyKeyPhoneNumber],
  [0xd19ae46d, _privacyKeyPhoneNumber],
  [0xa8406ca9, _topPeerCategoryForwardUsers],
  [0xfbeec0f0, _topPeerCategoryForwardChats],
  [0xa26f881b, _channelAdminLogEventActionChangeLinkedChat],
  [0xe844ebff, _messagesSearchCounter],
  [0x10b78d29, _keyboardButtonUrlAuth],
  [0xd02e7fd4, _inputKeyboardButtonUrlAuth],
  [0x92d33a0e, _urlAuthResultRequest],
  [0x8f8c0e4e, _urlAuthResultAccepted],
  [0xa9d6db1f, _urlAuthResultDefault],
  [0x4c81c1ba, _inputPrivacyValueAllowChatParticipants],
  [0xd82363af, _inputPrivacyValueDisallowChatParticipants],
  [0x18be796b, _privacyValueAllowChatParticipants],
  [0xacae0690, _privacyValueDisallowChatParticipants],
  [0x9c4e7e8b, _messageEntityUnderline],
  [0xbf0693d4, _messageEntityStrike],
  [0x20df5d0, _messageEntityBlockquote],
  [0x6a7e7366, _updatePeerSettings],
  [0xbfb5ad8b, _channelLocationEmpty],
  [0x209b82db, _channelLocation],
  [0xca461b5d, _peerLocated],
  [0xb4afcfb0, _updatePeerLocated],
  [0xe6b76ae, _channelAdminLogEventActionChangeLocation],
  [0xdbd4feed, _inputReportReasonGeoIrrelevant],
  [0x53909779, _channelAdminLogEventActionToggleSlowMode],
  [0x44747e9a, _authAuthorizationSignUpRequired],
  [0xd8411139, _paymentsPaymentVerificationNeeded],
  [0x28703c8, _inputStickerSetAnimatedEmoji],
  [0x39a51dfb, _updateNewScheduledMessage],
  [0x90866cee, _updateDeleteScheduledMessages],
  [0xd072acb4, _restrictionReason],
  [0x3c5693e9, _inputTheme],
  [0xf5890df1, _inputThemeSlug],
  [0x483d270c, _themeDocumentNotModified],
  [0xf7d90ce0, _theme],
  [0xf41eb622, _accountThemesNotModified],
  [0x7f676421, _accountThemes],
  [0x8216fba3, _updateTheme],
  [0xd1219bdd, _inputPrivacyKeyAddedByPhone],
  [0x42ffd42b, _privacyKeyAddedByPhone],
]);

const u = undefined;
const i32 = () => r.int32();
const i64 = () => r.int64();
const i128 = () => r.int128();
const i256 = () => r.int256();
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
  if (f) {
    return f();
  }

  throw new Error(`Unknown constructor 0x${c.toString(16)}.`);
}
