import { Layout } from './Layout';

export function Xsearch() {
  return (
    <Layout title="Xsearch">
      <form method="post" target="_blank">
        <fieldset>
          <legend>キーワード</legend>
          <input type="text" name="query" placeholder="Enter search query" required autocomplete="off" />
          <label>
            <input type="checkbox" name="exactMatch" value="true" />
            単語をダブルクォーテーションで囲む
          </label>
        </fieldset>
        <fieldset>
          <legend>検索条件</legend>
          <label>
            <input type="checkbox" name="japaneseOnly" value="true" />
            日本語のツイートのみ検索
          </label>
          <label>
            <input type="checkbox" name="excludeReplies" value="true" />
            リプライを除外
          </label>
        </fieldset>
        <fieldset>
          <legend>表示</legend>
          <label>
            <input type="checkbox" name="followersOnly" value="true" />
            フォロー中のツイートのみ表示
          </label>
          <label>
            <input type="checkbox" name="latestOnly" value="true" />
            最新タブで表示
          </label>
        </fieldset>
        <details>
          <summary>高度な条件</summary>
          <label>
            <select name="filter" class="w-full p-3 border rounded-lg">
              <option value="" selected>
                フィルターを選択
              </option>
              <option value="filter:images">画像のみ</option>
              <option value="filter:links">リンクのみ</option>
              <option value="-filter:images">画像を除外</option>
              <option value="-filter:links">リンクを除外</option>
            </select>
          </label>
          <div class="grid">
            <label>
              <select name="countType">
                <option value="" selected>
                  filterType
                </option>
                <option value="min_faves">min faves</option>
                <option value="max_faves">max faves</option>
                <option value="min_replies">min replies</option>
                <option value="max_replies">max replies</option>
              </select>
            </label>
            <label>
              <input type="number" name="countValue" placeholder="countValue" />
            </label>
          </div>
          <div class="grid">
            <label>
              <input type="date" name="since" />
            </label>
            <label>
              <input type="date" name="until" />
            </label>
          </div>
        </details>
        <button type="submit">Search</button>
      </form>
    </Layout>
  );
}
