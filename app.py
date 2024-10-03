from flask import Flask, render_template, request, send_from_directory, jsonify
import os
import json
from jinja2 import Template

app = Flask(__name__)

# Load configuration data
def load_config(work_type):
    config_path = os.path.join(app.root_path, 'config', 'genres.json')
    with open(config_path, 'r') as f:
        genres_data = json.load(f)
    return genres_data.get(work_type, {})

@app.route('/config/<path:filename>')
def config_files(filename):
    config_dir = os.path.join(app.root_path, 'config')
    return send_from_directory(config_dir, filename)

@app.route('/', methods=['GET', 'POST'])
def index():
    genres_data_fiction = load_config('Fiction')
    genres_data_nonfiction = load_config('Non-Fiction')
    if request.method == 'POST':
        # Collect common data
        prompt_name = request.form.get('prompt_name', 'Untitled')
        work_type = request.form.get('work_type', '')
        user_inputs = {'prompt_name': prompt_name, 'work_type': work_type}

        if work_type == 'Fiction':
            # Collect fiction-specific data
            genre = request.form.get('genre', 'General')
            subgenres = request.form.getlist('subgenres[]')
            narrative_perspective = request.form.get('narrative_perspective', 'Third Person')
            themes = request.form.getlist('themes[]')
            tone = request.form.get('tone', 'Neutral')
            writing_style = request.form.get('writing_style', 'Standard')
            setting = request.form.get('setting', '')
            characters = request.form.get('characters', '')
            plot_overview = request.form.get('plot_overview', '')
            length = request.form.get('length', 'Short')
            additional_notes = request.form.get('additional_notes', '')

            user_inputs.update({
                'genre': genre,
                'subgenres': subgenres,
                'narrative_perspective': narrative_perspective,
                'themes': themes,
                'tone': tone,
                'writing_style': writing_style,
                'setting': setting,
                'characters': characters,
                'plot_overview': plot_overview,
                'length': length,
                'additional_notes': additional_notes
            })

            # Generate prompt
            final_prompt = generate_prompt('fiction', user_inputs)

        elif work_type == 'Non-Fiction':
            # Collect non-fiction-specific data
            subject_matter = request.form.get('subject_matter', 'General')
            purpose = request.form.get('purpose', '')
            audience = request.form.getlist('audience[]')
            tone = request.form.get('tone_nonfiction', 'Neutral')
            writing_style = request.form.get('writing_style_nonfiction', 'Standard')
            length = request.form.get('length_nonfiction', 'Medium')
            additional_notes = request.form.get('additional_notes_nonfiction', '')

            user_inputs.update({
                'subject_matter': subject_matter,
                'purpose': purpose,
                'audience': audience,
                'tone': tone,
                'writing_style': writing_style,
                'length': length,
                'additional_notes': additional_notes
            })

            # Generate prompt
            final_prompt = generate_prompt('nonfiction', user_inputs)

        else:
            final_prompt = "Invalid work type selected."

        print(f"User Inputs: {user_inputs}")
        print(f"Generated Prompt: {final_prompt}")

        return render_template('result.html', final_prompt=final_prompt, user_inputs=user_inputs)


    else:
        return render_template('index.html')


def generate_prompt(work_type, inputs):
    """
    Generates a prompt based on the work type and user inputs using external template files.
    """
    # Determine the template file based on work type
    if work_type == 'fiction':
        template_file = os.path.join(app.root_path, 'prompts', 'fiction_prompt_template.txt')
    elif work_type == 'nonfiction':
        template_file = os.path.join(app.root_path, 'prompts', 'nonfiction_prompt_template.txt')
    else:
        return "Invalid work type selected."

    # Read the template file
    with open(template_file, 'r') as file:
        template_content = file.read()

    # Create a Template object
    template = Template(template_content)

    # Render the template with user inputs
    prompt = template.render(**inputs)

    return prompt.strip()

if __name__ == '__main__':
    app.run(debug=True)
