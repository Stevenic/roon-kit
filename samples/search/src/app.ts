import { RoonExtension, Item, RoonApiBrowseOptions, RoonCore } from 'roon-kit';
import { v4 } from 'uuid';

const extension = new RoonExtension({
    description: {
        extension_id:        'roon-kit-search',
        display_name:        "Roon Kit Search Test",
        display_version:     "0.1.0",
        publisher:           'roon-kit',
        email:               'stevenic@microsoft.com',
        website:             'https://github.com/Stevenic/roon-kit'
    },
    RoonApiBrowse: 'required',
    log_level: 'none'
});

extension.start_discovery();

(async () => {
    say(`Waiting for core to pair. Enable extension if needed.`)
    const core = await extension.get_core();

    say(`Ok I'm ready. Say 'quit' if you'd like to exit.`);
    while (true) {
        const query = await ask('\nWhat would you like me to find?');
        if (query != 'quit') {
            const sessionKey = v4();
            const items = await getListItems(core, sessionKey, {
                hierarchy: 'search',
                input: query
            });
            if (items.length > 0) {
                say(`Here's what I found:`);
                await sayItems(core, sessionKey, items);
            } else {
                say(`I'm sorry I couldn't find anything`);
            }
        } else {
            process.exit();
        }
    }

})();

async function getListItems(core: RoonCore, sessionKey: string, options: RoonApiBrowseOptions, maxCount = 5): Promise<Item[]> {
    const result = await core.services.RoonApiBrowse.browse({...options, multi_session_key: sessionKey});
    if (result.list && result.list.count > 0) {
        const loaded = await core.services.RoonApiBrowse.load({
            multi_session_key: sessionKey,
            hierarchy: options.hierarchy,
            level: result.list.level,
            count: Math.min(result.list.count, maxCount)
        });
        return loaded.items ?? [];
    }

    return [];
}

async function sayItems(core: RoonCore, sessionKey: string, items: Item[]): Promise<void> {
    for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item.subtitle && item.subtitle != item.title) {
            say(`\t${item.title} - ${item.subtitle}`);
        } else {
            say(`\t${item.title}`);
        }
        if (item.hint == 'list') {
            const children = await getListItems(core, sessionKey, {
                hierarchy: 'search',
                item_key: item.item_key
            });
            for (let j = 0; j < children.length; j++) {
                const child = children[j];
                if (child.hint != 'action' && child.subtitle) {
                    say(`\t\t${child.title} - ${child.subtitle}`);
                }
            }
        }
    }
}

import readline from 'readline';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function say(textOrObject: string|object): void {
    console.log(typeof textOrObject == 'string' ? textOrObject : JSON.stringify(textOrObject));
}

function ask(prompt: string): Promise<string> {
    return new Promise((resolve) => {
        rl.question(prompt + ' ', resolve);
    });
}